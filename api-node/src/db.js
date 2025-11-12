const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dbPath =
  process.env.SQLITE_DB_PATH ||
  path.join(__dirname, '..', 'database', 'library.db');

const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    num_paginas INTEGER NOT NULL,
    isbn TEXT NOT NULL UNIQUE,
    editora TEXT NOT NULL,
    autor TEXT NOT NULL,
    imagem_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const colunas = db.pragma("table_info(livros)");
const possuiColunaImagem = colunas.some((coluna) => coluna.name === 'imagem_url');

function garantirColuna(nome, definicao) {
  const existe = colunas.some((coluna) => coluna.name === nome);
  if (!existe) {
    db.exec(`
      ALTER TABLE livros
      ADD COLUMN ${nome} ${definicao};
    `);
  }
}

garantirColuna('imagem_url', 'TEXT');
garantirColuna('autor', 'TEXT DEFAULT ""');

module.exports = db;

