const express = require('express');
const livrosRepository = require('../repositories/livrosRepository');

const router = express.Router();

function normalizarLivroPayload(body) {
  if (!body) return body;
  return {
    titulo: typeof body.titulo === 'string' ? body.titulo.trim() : body.titulo,
    num_paginas: body.num_paginas,
    isbn: typeof body.isbn === 'string' ? body.isbn.trim() : body.isbn,
    editora: typeof body.editora === 'string' ? body.editora.trim() : body.editora,
    autor: typeof body.autor === 'string' ? body.autor.trim() : body.autor,
    imagem_url: typeof body.imagem_url === 'string' ? body.imagem_url.trim() : body.imagem_url,
  };
}

function validarLivroPayload(body, options = { partial: false }) {
  const erros = [];

  const camposObrigatorios = ['titulo', 'num_paginas', 'isbn', 'editora', 'autor', 'imagem_url'];

  camposObrigatorios.forEach((campo) => {
    if (!options.partial && (body[campo] === undefined || body[campo] === null || body[campo] === '')) {
      erros.push(`Campo obrigatório ausente: ${campo}`);
    }
  });

  if (body.titulo !== undefined && typeof body.titulo !== 'string') {
    erros.push('Campo titulo deve ser uma string.');
  }

  if (body.editora !== undefined && typeof body.editora !== 'string') {
    erros.push('Campo editora deve ser uma string.');
  }

  if (body.autor !== undefined && typeof body.autor !== 'string') {
    erros.push('Campo autor deve ser uma string.');
  }

  if (body.isbn !== undefined && typeof body.isbn !== 'string') {
    erros.push('Campo isbn deve ser uma string.');
  }

  if (body.imagem_url !== undefined && typeof body.imagem_url !== 'string') {
    erros.push('Campo imagem_url deve ser uma string.');
  }

  if (body.num_paginas !== undefined) {
    const paginas = Number(body.num_paginas);
    if (!Number.isInteger(paginas) || paginas <= 0) {
      erros.push('Campo num_paginas deve ser um número inteiro positivo.');
    }
  }

  return erros;
}

router.get('/', (req, res) => {
  const livros = livrosRepository.findAll().map(({ numPaginas, imagemUrl, autor, ...resto }) => ({
    ...resto,
    num_paginas: numPaginas,
    autor,
    imagem_url: imagemUrl,
  }));
  res.json(livros);
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensagem: 'ID inválido.' });
  }

  const livro = livrosRepository.findById(id);

  if (!livro) {
    return res.status(404).json({ mensagem: 'Livro não encontrado.' });
  }

  const { numPaginas, imagemUrl, autor, ...resto } = livro;
  return res.json({ ...resto, num_paginas: numPaginas, autor, imagem_url: imagemUrl });
});

router.post('/', (req, res) => {
  const payload = normalizarLivroPayload(req.body);
  const erros = validarLivroPayload(payload);

  if (erros.length > 0) {
    return res.status(400).json({ mensagem: 'Erro de validação.', erros });
  }

  if (livrosRepository.findByIsbn(payload.isbn)) {
    return res.status(409).json({ mensagem: 'ISBN já cadastrado.' });
  }

  const livroCriado = livrosRepository.create({
    ...payload,
    num_paginas: Number(payload.num_paginas),
  });

  const { numPaginas, imagemUrl, autor, ...resto } = livroCriado;

  return res.status(201).json({
    mensagem: 'Livro criado com sucesso.',
    livro: { ...resto, num_paginas: numPaginas, autor, imagem_url: imagemUrl },
  });
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensagem: 'ID inválido.' });
  }

  const payload = normalizarLivroPayload(req.body);
  const erros = validarLivroPayload(payload);

  if (erros.length > 0) {
    return res.status(400).json({ mensagem: 'Erro de validação.', erros });
  }

  const livroExistente = livrosRepository.findById(id);

  if (!livroExistente) {
    return res.status(404).json({ mensagem: 'Livro não encontrado.' });
  }

  if (payload.isbn !== livroExistente.isbn) {
    const isbnEmUso = livrosRepository.findByIsbn(payload.isbn);
    if (isbnEmUso && isbnEmUso.id !== id) {
      return res.status(409).json({ mensagem: 'ISBN já cadastrado.' });
    }
  }

  const livroAtualizado = livrosRepository.update(id, {
    ...payload,
    num_paginas: Number(payload.num_paginas),
  });

  if (!livroAtualizado) {
    return res.status(500).json({ mensagem: 'Não foi possível atualizar o livro.' });
  }

  const { numPaginas, imagemUrl, autor, ...resto } = livroAtualizado;

  return res.json({
    mensagem: 'Livro atualizado com sucesso.',
    livro: { ...resto, num_paginas: numPaginas, autor, imagem_url: imagemUrl },
  });
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensagem: 'ID inválido.' });
  }

  const removido = livrosRepository.remove(id);

  if (!removido) {
    return res.status(404).json({ mensagem: 'Livro não encontrado.' });
  }

  return res.json({ mensagem: 'Livro removido com sucesso.' });
});

module.exports = router;

