import { Router } from 'express';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import UsersRepository from '../../typeorm/repositories/UsersRepository';

const sessionsRoutes = Router();

sessionsRoutes.post('/', async (request, response) => {
  const usersRepository = new UsersRepository();
  const { email, password } = request.body;
  const authenticate = new AuthenticateUserService(usersRepository);
  const { user, token } = await authenticate.execute({ email, password });
  return response.json({ user, token });
});

export default sessionsRoutes;
