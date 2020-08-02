import React, { FC } from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';

import { Container, ButtonText } from './styles';

interface ButtonProps extends RectButtonProperties {
  children: string;
}

const Button: FC<ButtonProps> = ({ children, ...props }) => (
  <Container {...props}>
    <ButtonText>{children}</ButtonText>
  </Container>
);

export default Button;
