/* eslint-disable camelcase */
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import React, { useState, FormEvent, useEffect } from 'react';

import api from '../../services/api';
import logoImage from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles';

export interface Repository {
  full_name: string;
  description: string;
  forks_count: number;
  stargazers_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepositories = localStorage.getItem(
      '@GithubExplorer:repositories',
    );
    if (storageRepositories) {
      return JSON.parse(storageRepositories);
    }
    return [];
  });
  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);
  async function handleAddRepository(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newRepo.trim()) {
      setInputError('Digite o autor/nome do repositório');
      return;
    }
    try {
      const response = await api.get<Repository>(`/repos/${newRepo}`);
      setRepositories([...repositories, response.data]);
      setNewRepo('');
      setInputError('');
    } catch (error) {
      setInputError('Erro na busca por esse repositório');
    }
  }
  return (
    <>
      <img src={logoImage} alt="Github Explorer" />
      <Title>Explore repositórios no Github</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map(({ owner, full_name, description }) => (
          <Link to={`/repositories/${full_name}`} key={full_name}>
            <img src={owner.avatar_url} alt={owner.login} />
            <div>
              <strong>{full_name}</strong>
              <p>{description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
