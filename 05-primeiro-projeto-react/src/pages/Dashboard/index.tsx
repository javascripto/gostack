/* eslint-disable camelcase */
import { FiChevronRight } from 'react-icons/fi';
import React, { useState, FormEvent } from 'react';

import api from '../../services/api';
import logoImage from '../../assets/logo.svg';
import { Title, Form, Repositories } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  async function handleAddRepository(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await api.get<Repository>(`/repos/${newRepo}`);
    setRepositories([...repositories, response.data]);
    setNewRepo('');
  }
  return (
    <>
      <img src={logoImage} alt="" />
      <Title>Explore repositórios no Github</Title>

      <Form onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      <Repositories>
        {repositories.map(({ owner, full_name, description }) => (
          <a href={full_name} key={full_name}>
            <img src={owner.avatar_url} alt={owner.login} />
            <div>
              <strong>{full_name}</strong>
              <p>{description}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
