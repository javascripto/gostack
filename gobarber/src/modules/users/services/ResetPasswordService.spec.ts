import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import ResetPasswordService from './ResetPasswordService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('ResetPasswordService', () => {
  let hashProvider: FakeHashProvider;
  let usersRepository: FakeUsersRepository;
  let resetPasswordService: ResetPasswordService;
  let userTokensRepository: FakeUserTokensRepository;

  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    usersRepository = new FakeUsersRepository();
    userTokensRepository = new FakeUserTokensRepository();
    resetPasswordService = new ResetPasswordService(
      usersRepository,
      userTokensRepository,
      hashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const generateHash = jest.spyOn(hashProvider, 'generateHash').mockName('generateHash');
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const { token } = await userTokensRepository.generate(user.id);

    await resetPasswordService.execute({ token, password: '123123' });

    const updatedUser = await usersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });

  it('should not be able to reset password for a non-existing token', async () => {
    await expect(resetPasswordService.execute({
      token: 'fake token',
      password: 'fake password',
    }))
      .rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset a password for a non-existing user', async () => {
    const { token } = await userTokensRepository.generate('fake user id');
    await expect(resetPasswordService.execute({
      token,
      password: 'fake password',
    }))
      .rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if passed more than 2 hours', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const { token } = await userTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(resetPasswordService.execute({
      token,
      password: '123123',
    }))
      .rejects.toBeInstanceOf(AppError);
  });
});
