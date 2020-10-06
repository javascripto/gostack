import { Router } from 'express';

import { celebrate, Joi, Segments } from 'celebrate';
import ResetPasswordController from '../controllers/ResetPasswordController';
import ForgotPasswordController from '../controllers/ForgotPasswordController';

const passwordRoutes = Router();

const resetPasswordController = new ResetPasswordController();
const forgotPasswordController = new ForgotPasswordController();

passwordRoutes.post('/reset', celebrate({
  [Segments.BODY]: {
    token: Joi.string().uuid().required(),
    password: Joi.string().required(),
    password_confirmation: Joi.string().required().valid(Joi.ref('password')),
  },
}), resetPasswordController.create);

passwordRoutes.post('/forgot', celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required(),
  },
}), forgotPasswordController.create);

export default passwordRoutes;
