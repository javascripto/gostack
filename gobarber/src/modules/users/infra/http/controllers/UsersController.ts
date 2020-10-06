import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/CreateUserService';

class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createUser = container.resolve(CreateUserService);
    const { name, email, password } = request.body;
    const user = await createUser.execute({ name, email, password });
    return response.json(classToClass(user));
  }
}

export default UsersController;
