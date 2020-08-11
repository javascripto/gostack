import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject(UsersRepository.name)
    private userRepository: UsersRepository,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError('Incorrect email/password combination.', 401);
    }
    delete user.password;
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      expiresIn,
      subject: user.id,
    });
    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
