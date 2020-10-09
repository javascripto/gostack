import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('UpdateUserAvatarService', () => {
  let hashProvider: FakeHashProvider;
  let storageProvider: FakeStorageProvider;
  let userRepository: FakeUsersRepository;
  let fakeCacheProvider: FakeCacheProvider;
  let createUser: CreateUserService;
  let updateUserAvatar: UpdateUserAvatarService;

  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    storageProvider = new FakeStorageProvider();
    userRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(userRepository, hashProvider, fakeCacheProvider);
    updateUserAvatar = new UpdateUserAvatarService(
      userRepository,
      storageProvider,
    );
  });

  it('should be able to update user avatar', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      avatarFileName: 'teste.png',
      user_id: user.id,
    });

    const findUser = await userRepository.findById(user.id);
    expect(findUser?.avatar).toBe('teste.png');
  });

  it('should not be able to update user avatar if user is not registered', async () => {
    await expect(updateUserAvatar.execute({
      avatarFileName: 'teste.png',
      user_id: '123',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update a new user avatar', async () => {
    const deleteFile = jest.spyOn(storageProvider, 'deleteFile');

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      avatarFileName: 'teste.png',
      user_id: user.id,
    });

    await updateUserAvatar.execute({
      avatarFileName: 'teste2.png',
      user_id: user.id,
    });

    const findUser = await userRepository.findById(user.id);
    expect(deleteFile).toHaveBeenCalledWith('teste.png');
    expect(findUser?.avatar).toBe('teste2.png');
  });
});
