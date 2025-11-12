import { useState } from 'react';
import Header from '../../components/Header/Header';
import './index.scss';
import SubmenuLivros from '../../components/SubmenuLivros/SubmenuLivros';
import { LivrosService } from '../../api/LivrosService';

const LivrosCadastro = () => {
  
  const [livro, setLivro] = useState({
    titulo: '',
    num_paginas: '',
    isbn: '',
    editora: '',
    autor: '',
    imagem_url: '',
  });
  const [salvando, setSalvando] = useState(false);

  const handleChange = (field) => (event) => {
    setLivro((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  async function createLivro(event) {
    event.preventDefault();
    if (!livro.titulo || !livro.num_paginas || !livro.isbn || !livro.editora || !livro.autor || !livro.imagem_url) {
      alert('Preencha todos os campos antes de salvar.');
      return;
    }

    setSalvando(true);

    const body = {
      titulo: livro.titulo.trim(),
      num_paginas: Number(livro.num_paginas),
      isbn: livro.isbn.trim(),
      editora: livro.editora.trim(),
      autor: livro.autor.trim(),
      imagem_url: livro.imagem_url.trim(),
    };

    try {
      const { data } = await LivrosService.createLivro(body);
      alert(data.mensagem);
      setLivro({
        titulo: '',
        num_paginas: '',
        isbn: '',
        editora: '',
        autor: '',
        imagem_url: '',
      });
    } catch (error) {
      const status = error?.response?.status || 500;
      const mensagem =
        error?.response?.data?.mensagem ||
        error?.response?.data ||
        'Erro ao cadastrar o livro.';
      alert(`${status} - ${mensagem}`);
    } finally {
      setSalvando(false);
    }

  }

  return (
  <>
    <Header/>
    <SubmenuLivros/>
    <div className='livrosCadastro'>
        <h1>Cadastro de Livros</h1>
        <div>
          <form id="formulario" onSubmit={createLivro}>
          <div className='form-group'>
            <label>Titulo</label>
            <input type="text" id='titulo' required value={livro.titulo} onChange={handleChange('titulo')}></input>
          </div>
          <div className='form-group'>
            <label>Número de Páginas</label>
            <input type="number" id='num' min="1" required value={livro.num_paginas} onChange={handleChange('num_paginas')}></input>
          </div>
          <div className='form-group'>
            <label>ISBN</label>
            <input type="text" id='isbn' required value={livro.isbn} onChange={handleChange('isbn')}></input>
          </div>
          <div className='form-group'>
            <label>Editora</label>
            <input type="text" id='editora' required value={livro.editora} onChange={handleChange('editora')}></input>
          </div>
          <div className='form-group'>
            <label>Autor</label>
            <input type="text" id='autor' required value={livro.autor} onChange={handleChange('autor')}></input>
          </div>
          <div className='form-group'>
            <label>URL da Imagem</label>
            <input type="url" id='imagem' required placeholder='https://...' value={livro.imagem_url} onChange={handleChange('imagem_url')}></input>
          </div>
          <div className='form-group'>
            <button type='submit' disabled={salvando}>
              {salvando ? 'Salvando...' : 'Cadastrar Livro'}
            </button>
          </div>
          </form>
        </div>
    </div>
  </>)
  
}

export default LivrosCadastro;