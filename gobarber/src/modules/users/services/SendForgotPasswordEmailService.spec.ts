import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

describe('SendForgotPasswordEmailService', () => {
  let mailProvider: FakeMailProvider;
  let usersRepository: FakeUsersRepository;
  let userTokensRepository: FakeUserTokensRepository;
  let sendForgotPasswordEmail: SendForgotPasswordEmailService;

  beforeEach(() => {
    mailProvider = new FakeMailProvider();
    usersRepository = new FakeUsersRepository();
    userTokensRepository = new FakeUserTokensRepository();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      usersRepository,
      mailProvider,
      userTokensRepository,
    );
  });

  it('should be able to recover the password using the e-mail', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail').mockName('sendMail');

    await usersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({ email: 'johndoe@example.com' });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    await expect(sendForgotPasswordEmail.execute({
      email: 'johndoe@example.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail').mockName('sendMail');
    const generate = jest.spyOn(userTokensRepository, 'generate').mockName('generate');

    const user = await usersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({ email: 'johndoe@example.com' });

    expect(sendMail).toHaveBeenCalled();
    expect(generate).toHaveBeenCalledWith(user.id);
  });
});

// RED, GREEN, REFACTOR
