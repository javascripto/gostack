import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
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
