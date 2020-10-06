import { container } from 'tsyringe';
import { Request, Response } from 'express';

import UpdadeUserAvatarService from '@modules/users/services/UpdadeUserAvatarService';
import { classToClass } from 'class-transformer';

class UserAvatarController {
  public async update(request: Request, response: Response) {
    const updateUserAvatar = container.resolve(UpdadeUserAvatarService);
    const user = await updateUserAvatar.execute({
      user_id: Object.getOwnPropertyDescriptor(request, 'user')?.value.id,
      avatarFileName: request.file.filename,
    });
    return response.json(classToClass(user));
  }
}

export default UserAvatarController;
