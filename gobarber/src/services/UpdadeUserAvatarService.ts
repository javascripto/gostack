import fs from 'fs';
import path from 'path';
import { getRepository } from 'typeorm';

import User from '../models/User';
import AppError from '../errors/AppError';
import uploadConfig from '../config/upload';

interface Request {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  async execute({ avatarFileName, user_id }: Request): Promise<User> {
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne(user_id);
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
    usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
