import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import Appointment from '../../typeorm/entities/Appointment';

class ProviderAppointmentsController {
  async index(request: Request, response: Response<Appointment[]>) {
    const provider_id = request.user.id;
    const { day, month, year } = request.query;

    const listProviderAppointments = container.resolve(ListProviderAppointmentsService);
    const appointments = await listProviderAppointments.execute({
      provider_id,
      day: Number(day),
      year: Number(year),
      month: Number(month),
    });
    return response.json(appointments);
  }
}

export default ProviderAppointmentsController;
