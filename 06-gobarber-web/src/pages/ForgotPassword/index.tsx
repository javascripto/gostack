import * as Yup from 'yup';
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { FiLogIn, FiMail } from 'react-icons/fi';
import React, { useRef, useCallback, useState } from 'react';

import api from '../../services/api';
import logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Content, Background, AnimationContainer } from './styles';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        });

        await schema.validate(data, { abortEarly: false });
        const { email } = data;
        await api.post('/password/forgot', { email });

        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado',
          description:
            'Enviamos um e-mail para recuperação de senha, cheque sua caixa de entrada',
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          return formRef.current?.setErrors(errors);
        }
        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description: 'Ocorreu um erro ao tentar recuperar a senha',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input
              name="email"
              type="text"
              icon={FiMail}
              placeholder="E-mail"
            />
            <Button type="submit" loading={loading}>
              Recuperar
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
