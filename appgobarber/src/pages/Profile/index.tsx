import * as Yup from 'yup';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import React, { useRef, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

import {
  View,
  Platform,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';

import {
  Title,
  Container,
  UserAvatar,
  UserAvatarButton,
  BackButton,
} from './styles';

interface UpdateProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile = (): JSX.Element => {
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmationInputRef = useRef<TextInput>(null);
  const { goBack } = useNavigation();
  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: UpdateProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string().when('password_confirmation', {
            is: value => value.length,
            then: Yup.string().required('Senha antiga necessária'),
            otherwise: Yup.string(),
          }),
          password: Yup.string().when('old_password', {
            is: value => value.length,
            then: Yup.string().min(6, 'Minimo 6 caracteres'),
            otherwise: Yup.string().notRequired(),
          }),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password')],
            'Confirmação incorreta',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        const formData = {
          name: data.name,
          email: data.email,
          ...(data.password ? data : {}),
        };

        const response = await api.put('/profile', formData);

        await updateUser(response.data);

        Alert.alert('Perfil atualizado com sucesso!');
        goBack();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          return formRef.current?.setErrors(errors);
        }
        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente',
        );
      }
    },
    [goBack, updateUser],
  );

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar câmera',
        chooseFromLibraryButtonTitle: 'Escolher da galeria',
        allowsEditing: true,
        maxHeight: 1000,
        maxWidth: 1000,
        quality: 0.7,
      },
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.error) {
          Alert.alert('Erro ao atualizar seu avatar');
          return;
        }
        const formData = new FormData();

        formData.append('avatar', {
          uri: response.uri,
          type: response.type,
          name: response.fileName,
          size: response.fileSize,
        });

        api.patch(`/users/avatar`, formData).then(({ data: userResponse }) => {
          updateUser(userResponse);
        });
      },
    );
  }, [updateUser]);

  return (
    <>
      <KeyboardAvoidingView
        enabled
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <Container>
            <BackButton onPress={goBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>
            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>
            <View>
              <Title>Meu perfil</Title>
            </View>
            <Form
              ref={formRef}
              onSubmit={handleSubmit}
              initialData={{
                name: user.name,
                email: user.email,
              }}
            >
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />
              <Input
                name="email"
                icon="mail"
                ref={emailInputRef}
                autoCorrect={false}
                placeholder="E-mail"
                returnKeyType="next"
                autoCapitalize="none"
                keyboardType="email-address"
                onSubmitEditing={() => {
                  oldPasswordInputRef.current?.focus();
                }}
              />
              <Input
                icon="lock"
                name="old_password"
                secureTextEntry
                placeholder="Senha atual"
                returnKeyType="send"
                ref={oldPasswordInputRef}
                textContentType="newPassword"
                containerStyle={{ marginTop: 16 }}
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />
              <Input
                icon="lock"
                name="password"
                secureTextEntry
                placeholder="Nova senha"
                returnKeyType="send"
                ref={passwordInputRef}
                textContentType="newPassword"
                onSubmitEditing={() => {
                  passwordConfirmationInputRef.current?.focus();
                }}
              />
              <Input
                icon="lock"
                name="password_confirmation"
                secureTextEntry
                placeholder="Confirmação de senha"
                returnKeyType="send"
                ref={passwordConfirmationInputRef}
                textContentType="newPassword"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />
              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
