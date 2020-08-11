import { container } from 'tsyringe';
import { Request, Response } from 'express';

import UpdadeUserAvatarService from '@modules/users/services/UpdadeUserAvatarService';

class UserAvatarController {
  public async update(request: Request, response: Response) {
    const updateUserAvatar = container.resolve(UpdadeUserAvatarService);
    const user = await updateUserAvatar.execute({
      user_id: Object.getOwnPropertyDescriptor(request, 'user')?.value.id,
      avatarFileName: request.file.filename,
    });
    delete user.password;
    return response.json(user);
  }
}

export default UserAvatarController;
