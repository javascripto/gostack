import { Router } from 'express';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

const sessionsRoutes = Router();
sessionsRoutes.post('/', async (request, response) => {
  const { email, password } = request.body;
  const authenticate = new AuthenticateUserService();
  const { user, token } = await authenticate.execute({ email, password });
  return response.json({ user, token });
});

export default sessionsRoutes;
