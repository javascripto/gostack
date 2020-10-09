import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUserService', () => {
  let createUser: CreateUserService;
  let hashProvider: FakeHashProvider;
  let usersRepository: FakeUsersRepository;
  let fakeCacheProvider: FakeCacheProvider;

  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    usersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(usersRepository, hashProvider, fakeCacheProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with the same e-mail', async () => {
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
