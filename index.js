require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const tar = require('tar')
const app = express()

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key para bypassar RLS
)

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, file.originalname)
})
const upload = multer({ storage })

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

// Middleware para validar token
async function validarToken(req, res, next) {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido' })
  }
  
  const token = authHeader.split(' ')[1]
  
  // Hash do token para comparar com o banco
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  
  // Buscar token no Supabase
  const { data, error } = await supabase
    .from('api_tokens')
    .select('*, usuarios(*)')
    .eq('token_hash', tokenHash)
    .eq('ativo', true)
    .single()
  
  if (error || !data) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' })
  }
  
  // Verificar expiração
  if (data.expira_em && new Date(data.expira_em) < new Date()) {
    return res.status(401).json({ erro: 'Token expirado' })
  }
  
  // Atualizar último uso
  await supabase
    .from('api_tokens')
    .update({ ultimo_uso: new Date().toISOString() })
    .eq('id', data.id)
  
  // Adicionar usuário ao request
  req.usuario = data.usuarios
  req.usuarioId = data.usuario_id
  
  next()
}

app.get('/', (req, res) => {
  res.json({ nome: 'MambaScript Registry', versao: '1.0.0' })
})

// Listar pacotes (público)
app.get('/pacotes', async (req, res) => {
  const { data, error } = await supabase
    .from('pacotes')
    .select(`
      *,
      versoes(numero_versao, downloads, criado_em),
      usuarios(nome)
    `)
    .order('downloads_totais', { ascending: false })
  
  if (error) return res.status(500).json({ erro: error.message })
  res.json(data)
})

// Publicar pacote (requer autenticação)
app.post('/pacotes/publicar', validarToken, upload.single('arquivo'), async (req, res) => {
  const { nome, versao, descricao } = req.body
  const usuarioId = req.usuarioId

  // Verificar se pacote já existe
  let { data: pacoteExistente } = await supabase
    .from('pacotes')
    .select('id, usuario_id')
    .eq('nome', nome)
    .single()

  if (pacoteExistente && pacoteExistente.usuario_id !== usuarioId) {
    return res.status(403).json({ erro: 'Você não tem permissão para publicar este pacote' })
  }

  let pacoteId = pacoteExistente?.id

  // Se pacote não existe, criar
  if (!pacoteExistente) {
    const { data: novoPacote, error } = await supabase
      .from('pacotes')
      .insert({
        nome,
        descricao,
        usuario_id: usuarioId
      })
      .select()
      .single()

    if (error) return res.status(500).json({ erro: error.message })
    pacoteId = novoPacote.id
  }

  // Criar versão
  const { error: versaoError } = await supabase
    .from('versoes')
    .insert({
      pacote_id: pacoteId,
      numero_versao: versao,
      arquivo_url: req.file.filename,
      tamanho_arquivo: req.file.size
    })

  if (versaoError) {
    return res.status(500).json({ erro: versaoError.message })
  }

  res.json({ sucesso: true, mensagem: `Pacote ${nome}@${versao} publicado!` })
})

// Download de pacote (público)
app.get('/pacotes/:nome/download', async (req, res) => {
  const { data: pacote } = await supabase
    .from('pacotes')
    .select('id')
    .eq('nome', req.params.nome)
    .single()

  if (!pacote) return res.status(404).json({ erro: 'Pacote não encontrado' })

  // Buscar última versão
  const { data: versao } = await supabase
    .from('versoes')
    .select('arquivo_url')
    .eq('pacote_id', pacote.id)
    .order('criado_em', { ascending: false })
    .limit(1)
    .single()

  if (!versao) return res.status(404).json({ erro: 'Versão não encontrada' })

  // Incrementar downloads
  await supabase.rpc('incrementar_downloads', { pacote_id: pacote.id })

  res.download(`./uploads/${versao.arquivo_url}`)
})

app.listen(PORT, () => {
  console.log(`Registry rodando na porta ${PORT}`)
})
