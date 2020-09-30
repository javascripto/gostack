import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ShowProfileService from '@modules/users/services/ShowProfileService';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

class ProfileController {
  async show(request: Request, response: Response) {
    const user_id = request.user.id;
    const showProfile = container.resolve(ShowProfileService);
    const user = await showProfile.execute({ user_id });
    return response.json(user);
  }

  async update(request: Request, response: Response) {
    const user_id = request.user.id;
    // eslint-disable-next-line object-curly-newline
    const { name, email, password, old_password } = request.body;
    const updateProfile = container.resolve(UpdateProfileService);
    const { password: _, ...user } = await updateProfile.execute({
      user_id, name, email, password, old_password,
    });
    return response.json(user);
  }
}

export default ProfileController;
