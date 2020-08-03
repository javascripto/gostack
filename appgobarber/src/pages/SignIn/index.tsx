import * as Yup from 'yup';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Icon from 'react-native-vector-icons/Feather';
import React, { FC, useCallback, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Image,
  Alert,
  Platform,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';

import {
  Title,
  Container,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';
import logoImg from '../../assets/logo.png';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: FC = () => {
  const passwordInputRef = useRef<TextInput>(null);
  const formRef = useRef<FormHandles>(null);
  const { navigate } = useNavigation();

  const handleSignIn = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().required('Senha obrigatória'),
      });

      await schema.validate(data, { abortEarly: false });
      const { email, password } = data;
      // await signIn({ email, password });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        return formRef.current?.setErrors(errors);
      }
      Alert.alert(
        'Erro na autenticação',
        'Ocorreu um erro ao fazer login, cheque as credenciais',
      );
    }
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        enabled
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Faça seu logon</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                name="email"
                icon="mail"
                autoCorrect={false}
                placeholder="E-mail"
                returnKeyType="next"
                autoCapitalize="none"
                keyboardType="email-address"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />
              <Input
                icon="lock"
                secureTextEntry
                name="password"
                placeholder="Senha"
                returnKeyType="send"
                ref={passwordInputRef}
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />
              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Entrar
              </Button>
            </Form>
            <ForgotPassword onPress={() => {}}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <CreateAccountButton onPress={() => navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
};

export default SignIn;
