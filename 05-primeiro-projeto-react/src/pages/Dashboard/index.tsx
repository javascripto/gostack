import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

import { Title, Form, Repositories } from './styles';
import logoImage from '../../assets/logo.svg';

const Dashboard = () => (
  <>
    <img src={logoImage} alt="" />
    <Title>Explore repositórios no Github</Title>

    <Form>
      <input placeholder="Digite o nome do repositório" />
      <button type="submit">Pesquisar</button>
    </Form>

    <Repositories>
      {[1, 2, 3].map((_, k) => (
        <a href="#test" key={k}>
          <img
            src="https://avatars1.githubusercontent.com/u/16804522?s=460&u=5c9161567a1d7fe0906f6e8c9d222bd49127f6fb&v=4"
            alt="Javascripto"
          />
          <div>
            <strong>javascripto/gostack</strong>
            <p>Repositorio com conteúdo do bootcamp GoStack 🚀️</p>
          </div>
          <FiChevronRight size={20} />
        </a>
      ))}
    </Repositories>
  </>
);

export default Dashboard;
