import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

describe('ShowProfileService', () => {
  let usersRepository: FakeUsersRepository;
  let showProfileService: ShowProfileService;

  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(usersRepository);
  });

  it('should be able to show the profile', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const userProfile = await showProfileService.execute({ user_id: user.id });
    expect(userProfile.name).toBe('John Doe');
    expect(userProfile.email).toBe('johndoe@example.com');
  });

  it('should not be able to show the profile from non-existing user', async () => {
    await expect(showProfileService.execute({
      user_id: 'fake-user-id',
    })).rejects.toBeInstanceOf(AppError);
  });
});
