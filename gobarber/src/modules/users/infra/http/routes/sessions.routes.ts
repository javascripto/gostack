import { Router } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

const sessionsRoutes = Router();

sessionsRoutes.post('/', async (request, response) => {
  const { email, password } = request.body;
  const authenticate = container.resolve(AuthenticateUserService);
  const { user, token } = await authenticate.execute({ email, password });
  return response.json({ user, token });
});

export default sessionsRoutes;
