import React, { ButtonHTMLAttributes } from 'react';

import { ButtonContainer } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...props }) => (
  <ButtonContainer type="button" {...props}>
    {loading ? 'Carregando...' : children}
  </ButtonContainer>
);

export default Button;
