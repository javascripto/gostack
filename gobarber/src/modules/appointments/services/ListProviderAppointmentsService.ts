import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  async execute({
    day,
    year,
    month,
    provider_id,
  }: IRequest): Promise<Appointment[]> {
    return this.appointmentsRepository.findAllInDayFromProvider({
      day,
      month,
      year,
      provider_id,
    });
  }
}

export default ListProviderAppointmentsService;
