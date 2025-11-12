import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import './index.scss';
import SubmenuLivros from '../../components/SubmenuLivros/SubmenuLivros';
import { useParams } from 'react-router-dom';
import { LivrosService } from '../../api/LivrosService';

const LivrosEdicao = () => {  
  let {livroId} = useParams();

  const [livro, setLivro] = useState({
    id: '',
    titulo: '',
    num_paginas: '',
    isbn: '',
    editora: '',
    autor: '',
    imagem_url: '',
  });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function editLivro(event) {
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
      const { data } = await LivrosService.updateLivro(Number(livro.id), body);
      alert(data.mensagem);
      setLivro((prev) => ({
        ...prev,
        ...data.livro,
      }));
    } catch (error) {
      const status = error?.response?.status || 500;
      const mensagem =
        error?.response?.data?.mensagem ||
        error?.response?.data ||
        'Erro ao atualizar o livro.';
      alert(`${status} - ${mensagem}`);
    } finally {
      setSalvando(false);
    }

  }

  useEffect(() => {
    async function carregarLivro() {
      try {
        setErro('');
        setCarregando(true);
        const { data } = await LivrosService.getLivro(livroId);
        setLivro({
          id: data.id,
          titulo: data.titulo,
          num_paginas: data.num_paginas,
          isbn: data.isbn,
          editora: data.editora,
          autor: data.autor,
          imagem_url: data.imagem_url || '',
        });
      } catch (error) {
        const mensagem =
          error?.response?.data?.mensagem || 'Não foi possível carregar o livro.';
        setErro(mensagem);
      } finally {
        setCarregando(false);
      }
    }

    carregarLivro();
  }, [livroId]);

  return (
  <>
    <Header/>
    <SubmenuLivros/>
    <div className='livrosCadastro'>
        <h1>Edição de Livros</h1>
        <div>
          {erro && <p className='livrosCadastro__erro'>{erro}</p>}
          {carregando ? (
            <p>Carregando dados do livro...</p>
          ) : (
            <form id="formulario" onSubmit={editLivro}>
              <div className='form-group'>
                <label>Id</label>
                <input type="text" disabled value={livro.id || ''}></input>
              </div>
              <div className='form-group'>
                <label>Titulo</label>
                <input type="text" required value={livro.titulo || ''} onChange={(event) => { setLivro({ ...livro, titulo: event.target.value }); }} ></input>
              </div>
              <div className='form-group'>
                <label>Número de Páginas</label>
                <input type="number" min="1" required value={livro.num_paginas || ''} onChange={(event) => { setLivro({ ...livro, num_paginas: event.target.value }); }}></input>
              </div>
              <div className='form-group'>
                <label>ISBN</label>
                <input type="text" required value={livro.isbn || ''} onChange={(event) => { setLivro({ ...livro, isbn: event.target.value }); }}></input>
              </div>
              <div className='form-group'>
                <label>Editora</label>
                <input type="text" required value={livro.editora || ''} onChange={(event) => { setLivro({ ...livro, editora: event.target.value }); }}></input>
              </div>
              <div className='form-group'>
                <label>Autor</label>
                <input type="text" required value={livro.autor || ''} onChange={(event) => { setLivro({ ...livro, autor: event.target.value }); }}></input>
              </div>
              <div className='form-group'>
                <label>URL da Imagem</label>
                <input type="url" required value={livro.imagem_url || ''} onChange={(event) => { setLivro({ ...livro, imagem_url: event.target.value }); }}></input>
              </div>
              <div className='form-group'>
                <button type='submit' disabled={salvando}>
                  {salvando ? 'Salvando...' : 'Atualizar Livro'}
                </button>
              </div>
            </form>
          )}
          </div>
    </div>
  </>)
  
}

export default LivrosEdicao;