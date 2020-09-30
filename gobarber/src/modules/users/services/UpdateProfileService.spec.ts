import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import UpdateProfileService from './UpdateProfileService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

describe('UpdateProfileService', () => {
  let hashProvider: FakeHashProvider;
  let usersRepository: FakeUsersRepository;
  let updateProfileService: UpdateProfileService;

  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    usersRepository = new FakeUsersRepository();
    updateProfileService = new UpdateProfileService(usersRepository, hashProvider);
  });

  it('should be able to update the profile', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const updateUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@example.com',
    });
    expect(updateUser.name).toBe('John Trê');
    expect(updateUser.email).toBe('johntre@example.com');
  });

  it('should not be able to change to another user email', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const user = await usersRepository.create({
      name: 'Test',
      email: 'test@example.com',
      password: '123456',
    });
    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@example.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'johntre@example.com',
      old_password: '123456',
      password: '123123',
    });
    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'johntre@example.com',
      password: '123123',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile from non-existing user', async () => {
    await expect(updateProfileService.execute({
      user_id: 'non-existing-user-id',
      name: 'Test',
      email: 'test@example.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password without old password', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'johntre@example.com',
      old_password: 'worng-old-password',
      password: '123123',
    })).rejects.toBeInstanceOf(AppError);
  });
});
