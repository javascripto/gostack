import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUserService', () => {
  const hashProvider = new FakeHashProvider();
  it('should be able to create a new user', async () => {
    const usersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(usersRepository, hashProvider);
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with the same e-mail', async () => {
    const usersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(usersRepository, hashProvider);
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe2@example.com',
      password: '123456',
    });
    await expect(createUser.execute({
      name: 'John Doe',
      email: 'johndoe2@example.com',
      password: '123456',
    })).rejects.toBeInstanceOf(AppError);
  });
});
