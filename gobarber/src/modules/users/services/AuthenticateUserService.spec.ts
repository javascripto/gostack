import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('AuthenticateUserService', () => {
  const hashProvider = new FakeHashProvider();

  it('should be able to authenticate', async () => {
    const userRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(userRepository, hashProvider);
    const authenticateUser = new AuthenticateUserService(userRepository, hashProvider);

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: user.email,
      password: '123456',
    });

    expect(response).toHaveProperty('token');
  });

  it('should be able to authenticate if user is not registered', async () => {
    const userRepository = new FakeUsersRepository();
    const authenticateUser = new AuthenticateUserService(userRepository, hashProvider);

    expect(authenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const userRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(userRepository, hashProvider);
    const authenticateUser = new AuthenticateUserService(userRepository, hashProvider);

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(authenticateUser.execute({
      email: 'johndoe@example.com',
      password: 'zxczxc',
    })).rejects.toBeInstanceOf(AppError);
  });
});
