import multer from 'multer';
import { Router } from 'express';
import { container } from 'tsyringe';

import uploadConfig from '@config/upload';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdadeUserAvatarService from '@modules/users/services/UpdadeUserAvatarService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const createUser = container.resolve(CreateUserService);
  const { name, email, password } = request.body;
  const user = await createUser.execute({ name, email, password });
  delete user.password;
  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = container.resolve(UpdadeUserAvatarService);
    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });
    delete user.password;
    return response.json(user);
  },
);

export default usersRouter;
