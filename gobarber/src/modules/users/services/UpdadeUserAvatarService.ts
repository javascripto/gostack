import fs from 'fs';
import path from 'path';
import { injectable, inject } from 'tsyringe';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject(UsersRepository.name)
    private usersRepository: UsersRepository,
  ) {}

  async execute({ avatarFileName, user_id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }
    if (user.avatar) {
      const userAvatarPath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarPath);
      if (userAvatarFileExists) {
        fs.promises.unlink(userAvatarPath);
      }
    }
    user.avatar = avatarFileName;
    this.usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
