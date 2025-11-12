const db = require('../db');

const selectAllStmt = db.prepare(`
  SELECT id, titulo, num_paginas AS numPaginas, isbn, editora, autor, imagem_url AS imagemUrl, created_at AS createdAt, updated_at AS updatedAt
  FROM livros
  ORDER BY id DESC
`);

const selectByIdStmt = db.prepare(`
  SELECT id, titulo, num_paginas AS numPaginas, isbn, editora, autor, imagem_url AS imagemUrl, created_at AS createdAt, updated_at AS updatedAt
  FROM livros
  WHERE id = ?
`);

const insertStmt = db.prepare(`
  INSERT INTO livros (titulo, num_paginas, isbn, editora, autor, imagem_url)
  VALUES (@titulo, @num_paginas, @isbn, @editora, @autor, @imagem_url)
`);

const updateStmt = db.prepare(`
  UPDATE livros
  SET titulo = @titulo,
      num_paginas = @num_paginas,
      isbn = @isbn,
      editora = @editora,
      autor = @autor,
      imagem_url = @imagem_url,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = @id
`);

const deleteStmt = db.prepare(`
  DELETE FROM livros WHERE id = ?
`);

const selectByIsbnStmt = db.prepare(`
  SELECT id FROM livros WHERE isbn = ?
`);

function findAll() {
  return selectAllStmt.all();
}

function findById(id) {
  return selectByIdStmt.get(id);
}

function findByIsbn(isbn) {
  return selectByIsbnStmt.get(isbn);
}

function create(data) {
  const info = insertStmt.run(data);
  return findById(info.lastInsertRowid);
}

function update(id, data) {
  const info = updateStmt.run({ ...data, id });
  return info.changes > 0 ? findById(id) : null;
}

function remove(id) {
  return deleteStmt.run(id).changes > 0;
}

module.exports = {
  findAll,
  findById,
  findByIsbn,
  create,
  update,
  remove,
};

