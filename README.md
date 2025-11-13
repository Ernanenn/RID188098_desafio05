# Sistema de Biblioteca Online

Projeto full stack construído para o desafio de integração API + Front-end, oferecendo um catálogo de livros consumido por uma interface React e persistido em uma API Node.js com SQLite.

## Visão Geral

- **Back-end** (`api-node/`): API REST em Node.js com Express, SQLite (via `better-sqlite3`) e migrações automáticas para manter o schema atualizado.
- **Front-end** (`projeto-react-dnc/`): Aplicação React (Vite) consumindo a API e provendo telas de listagem, cadastro, edição e remoção de livros.
- **Entidade principal**: Livros com os campos `id`, `titulo`, `num_paginas`, `isbn`, `editora`, `autor`, `imagem_url`.

## Estrutura de Pastas

```
.
├── api-node/                # Projeto Node.js (API REST)
│   ├── src/
│   │   ├── db.js            # Conexão e migração do banco SQLite
│   │   ├── repositories/
│   │   │   └── livrosRepository.js
│   │   ├── routes/
│   │   │   └── livrosRoutes.js
│   │   └── server.js
│   └── database/
│       └── library.db       # Base SQLite (gerada automaticamente)
└── projeto-react-dnc/       # Projeto React (Vite)
    ├── src/
    │   ├── api/LivrosService.js
    │   ├── views/...
    │   └── main.jsx
    └── public/
```

## Pré-requisitos

- Node.js 18+ (recomendado LTS)
- npm 9+

> Em Windows, execute os comandos em um PowerShell com permissões adequadas.

## Configuração e Execução

### API (Node.js)

```ps
cd api-node
npm install
npm run dev
```

O servidor sobe por padrão em `http://localhost:3000`. Um arquivo `database/library.db` é criado automaticamente caso não exista.  
Para produção no Render, defina `SQLITE_DB_PATH=/data/library.db` e anexe um Disk montado em `/data` para persistir os dados.

### Front-end (React)

```ps
cd projeto-react-dnc
npm install
npm run dev
```

O Vite inicia em `http://localhost:5173`. Certifique-se de que a API esteja rodando para o front consumir os dados.

### Variáveis de Ambiente

| Serviço  | Variável            | Descrição                                               | Valor padrão/local                             |
|----------|---------------------|---------------------------------------------------------|------------------------------------------------|
| API      | `PORT`              | Porta HTTP                                              | `3000`                                         |
| API      | `SQLITE_DB_PATH`    | Caminho do arquivo SQLite                               | `api-node/database/library.db`                 |
| Frontend | `VITE_API_BASE_URL` | URL base da API consumida pelo React                    | `http://localhost:3000`                        |

Crie um arquivo `.env` na pasta `api-node/` e outro em `projeto-react-dnc/` para sobrescrever valores em ambiente local. Em produção (Netlify/Render) configure as variáveis via painel.

## Endpoints Principais

| Método | Rota             | Descrição                                  |
|--------|------------------|--------------------------------------------|
| GET    | `/livros`        | Lista todos os livros                      |
| GET    | `/livros/:id`    | Detalha um livro específico                |
| POST   | `/livros`        | Cadastra um novo livro                     |
| PUT    | `/livros/:id`    | Atualiza por completo um livro existente   |
| DELETE | `/livros/:id`    | Remove um livro                            |

### Estrutura de Payload (POST/PUT)

```json
{
  "titulo": "Clean Code",
  "num_paginas": 420,
  "isbn": "978-0132350884",
  "editora": "Prentice Hall",
  "autor": "Robert C. Martin",
  "imagem_url": "https://exemplo.com/capa.jpg"
}
```

## Fluxo do Front-end

- **Listagem (`/livros`)**: exibe cards com capa, título, autor, número de páginas, editora e ISBN; permite editar ou excluir.
- **Cadastro (`/livros/cadastro`)**: formulário controlado com validação mínima antes do envio.
- **Edição (`/livros/edicao/:id`)**: carrega dados do livro, permite alterar todos os campos.
- **Remoção**: confirmação simples antes de chamar a API.

Comunicação via `axios` (`src/api/LivrosService.js`), lendo a base URL de `VITE_API_BASE_URL` (com fallback para `http://localhost:3000`). Há também o arquivo `public/_redirects` para compatibilidade de rotas no Netlify.

## Testes Manuais Recomendados

1. **Iniciar API** e **Front** conforme instruções.
2. **Cadastrar** um livro preenchendo todos os campos (incluindo URL válida de imagem).
3. Verificar o livro na listagem com imagem e metadados corretos.
4. **Editar** alterando campos (ex.: título e autor) e confirmar persistência.
5. **Excluir** para validar remoção.

## Publicação no GitHub

A partir da raiz do projeto:

```ps
git init
git remote add origin https://github.com/Ernanenn/RID188098_desafio05.git
git add .
git commit -m "feat: biblioteca online com api node e front react"
git push -u origin main
```

> Caso o branch remoto seja diferente (ex.: `master`), ajuste o último comando.

## Licença

Projeto produzido para fins educacionais/desafio técnico. Ajuste a licença conforme a necessidade do repositório.

