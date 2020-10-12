/* eslint-disable camelcase */
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import React, { useRef, useCallback } from 'react';
import { FiLock } from 'react-icons/fi';

import api from '../../services/api';
import logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Content, Background, AnimationContainer } from './styles';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password')],
            'Confirmação incorreta',
          ),
        });

        await schema.validate(data, { abortEarly: false });
        const { password, password_confirmation } = data;
        const token = new URL(window.location.href).searchParams.get('token');

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          token,
          password,
          password_confirmation,
        });

        history.push('/');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          return formRef.current?.setErrors(errors);
        }
        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente',
        });
      }
    },
    [addToast, history],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

            <Input
              name="password"
              type="password"
              icon={FiLock}
              placeholder="Nova Senha"
            />
            <Input
              name="password_confirmation"
              type="password"
              icon={FiLock}
              placeholder="Confirmação da senha"
            />
            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
