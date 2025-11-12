import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import './index.scss';
import SubmenuLivros from '../../components/SubmenuLivros/SubmenuLivros';
import { LivrosService } from '../../api/LivrosService';
import { Link } from 'react-router-dom';

const Livros = () => {

  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function getLivros() {
    try {
      setCarregando(true);
      setErro('');
      const { data } = await LivrosService.getLivros();
      setLivros(data);
    } catch (error) {
      const mensagem =
        error?.response?.data?.mensagem || 'Não foi possível carregar os livros.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  async function deleteLivro(livroId) {
    const valida = confirm(`Você realmente deseja remover o livro de ID: ${livroId}?`);
    if (valida) {
      try {
        const { data } = await LivrosService.deleteLivro(livroId);
        alert(data.mensagem);
        getLivros();
      } catch (error) {
        const status = error?.response?.status || 500;
        const mensagem =
          error?.response?.data?.mensagem || 'Erro ao remover o livro.';
        alert(`${status} - ${mensagem}`);
      }
    }
  }

  useEffect(() => {
    getLivros();
  }, []);

  return (
  <>
    <Header/>
    <SubmenuLivros/>
    <div className='livros'>
        <h1>Escolha o seu livro</h1>
        {erro && <p className='livros__erro'>{erro}</p>}
        {carregando ? (
          <p>Carregando livros...</p>
        ) : (
          <ul>
            {livros.length === 0 && !erro && <li>Nenhum livro cadastrado.</li>}
            {livros.map((livro) => (
              <li key={livro.id}>
                {livro.imagem_url && (
                  <img className='livros__capa' src={livro.imagem_url} alt={`Capa do livro ${livro.titulo}`} />
                )}
                <div className='livros__info'>
                  <strong>{livro.titulo}</strong>
                  <span>{`Autor: ${livro.autor}`}</span>
                  <span>{livro.editora}</span>
                  <span>{`${livro.num_paginas} páginas`}</span>
                  <span>{`ISBN: ${livro.isbn}`}</span>
                </div>
                <div className='botoes'>
                  <div>
                    <Link className='btn edit' to={`/livros/edicao/${livro.id}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                      </svg>
                    </Link>
                  </div>
                  <div>
                    <button className='btn delete' type='button' onClick={() => { deleteLivro(livro.id); }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                </li>
            ))}
          </ul>
        )}
    </div>
  </>)
  
}

export default Livros;