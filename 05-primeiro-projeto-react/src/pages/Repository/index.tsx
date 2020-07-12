/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { useRouteMatch } from 'react-router-dom';

interface RepositoryParams {
  repository: string;
}

const Repository = () => {
  const { params } = useRouteMatch<RepositoryParams>();
  return <h1>Repository: {params.repository}</h1>;
};

export default Repository;
