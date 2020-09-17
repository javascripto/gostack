import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

class ResetPasswordController {
  public async create(request: Request, response: Response) {
    const { password, token } = request.body;
    const sendForgotPasswordEmailService = container.resolve(ResetPasswordService);
    await sendForgotPasswordEmailService.execute({ password, token });
    return response.status(204).json();
  }
}

export default ResetPasswordController;
