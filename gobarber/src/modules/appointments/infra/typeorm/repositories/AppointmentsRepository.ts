import { Repository, getRepository, Raw } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: {
        date,
        provider_id,
      },
    });
    return findAppointment;
  }

  public async create({ date, provider_id, user_id }: ICreateAppointmentDTO) {
    const appointment = this.ormRepository.create({ date, provider_id, user_id });
    await this.ormRepository.save(appointment);
    return appointment;
  }

  async findAllInMonthFromProvider({ provider_id, year, month }: IFindAllInMonthFromProviderDTO) {
    const parsedMonth = String(month).padStart(2, '0');

    return this.ormRepository.find({
      where: {
        provider_id,
        date: Raw((dateFieldName) => (
          `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        )),
      },
    });
  }

  async findAllInDayFromProvider({
    provider_id, year, month, day,
  }: IFindAllInDayFromProviderDTO) {
    const parsedMonth = String(month).padStart(2, '0');
    const parsedDay = String(day).padStart(2, '0');

    return this.ormRepository.find({
      where: {
        provider_id,
        date: Raw((dateFieldName) => (
          `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
        )),
      },
      relations: ['user'],
    });
  }
}

export default AppointmentsRepository;
