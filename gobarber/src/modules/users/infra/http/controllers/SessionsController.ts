import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

class SessionsController {
  public async create(request: Request, response: Response) {
    const { email, password } = request.body;
    const authenticate = container.resolve(AuthenticateUserService);
    const { user, token } = await authenticate.execute({ email, password });
    return response.json({ user: classToClass(user), token });
  }
}

export default SessionsController;
