import { Router } from 'express';

import ResetPasswordController from '../controllers/ResetPasswordController';
import ForgotPasswordController from '../controllers/ForgotPasswordController';

const passwordRoutes = Router();

const resetPasswordController = new ResetPasswordController();
const forgotPasswordController = new ForgotPasswordController();

passwordRoutes.post('/reset', resetPasswordController.create);
passwordRoutes.post('/forgot', forgotPasswordController.create);

export default passwordRoutes;
