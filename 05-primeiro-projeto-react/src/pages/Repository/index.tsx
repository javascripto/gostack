/* eslint-disable camelcase */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';
import logoImage from '../../assets/logo.svg';
import { Repository as IRepository } from '../Dashboard';
import { Header, RepositoryInfo, Issues } from './styles';

interface RepositoryParams {
  repository: string;
}

interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}

const Repository = () => {
  const { params } = useRouteMatch<RepositoryParams>();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [repository, setRepository] = useState<IRepository>();
  useEffect(() => {
    Promise.all([
      api.get(`repos/${params.repository}`),
      api.get(`repos/${params.repository}/issues`),
    ])
      .then(responses => responses.map(({ data }) => data))
      .then(([_repository, _issues]) => {
        setIssues(_issues);
        setRepository(_repository);
      });
  }, [params.repository]);
  return (
    <>
      <Header>
        <img src={logoImage} alt="Github Explorer" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      {repository && (
        <RepositoryInfo>
          <header>
            <img
              alt={repository.owner.login}
              src={repository.owner.avatar_url}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      <Issues>
        {issues.map(({ id, title, html_url, user: { login } }) => (
          <a key={id} href={html_url} target="_blank" rel="noopener noreferrer">
            <div>
              <strong>{title}</strong>
              <p>{login}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  );
};

export default Repository;
