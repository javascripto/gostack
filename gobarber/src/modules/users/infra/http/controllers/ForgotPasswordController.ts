import { container } from 'tsyringe';
import { Request, Response } from 'express';

import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

class ForgotPasswordController {
  public async create(request: Request, response: Response) {
    const { email } = request.body;
    const sendForgotPasswordEmailService = container.resolve(SendForgotPasswordEmailService);
    await sendForgotPasswordEmailService.execute({ email });
    return response.status(204).json();
  }
}

export default ForgotPasswordController;
