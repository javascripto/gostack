import { container } from 'tsyringe';
import { Request, Response } from 'express';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date } = request.body;
    const createAppointment = container.resolve(CreateAppointmentService);
    const appointment = await createAppointment.execute({
      date,
      user_id,
      provider_id,
    });
    return response.json(appointment);
  }
}

export default AppointmentsController;
