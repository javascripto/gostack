import { uuid } from 'uuidv4';
import {
  getYear, getMonth, getDate, isEqual,
} from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = []

  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
    return this.appointments.find(
      (appointment) => isEqual(appointment.date, date) && provider_id === appointment.provider_id,
    );
  }

  public async create({ date, provider_id, user_id }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();
    appointment.id = uuid();
    appointment.date = date;
    appointment.provider_id = provider_id;
    appointment.user_id = user_id;
    this.appointments.push(appointment);
    return appointment;
  }

  async findAllInMonthFromProvider({
    year,
    month,
    provider_id,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    return this.appointments.filter((appointment) => (
      appointment.provider_id === provider_id
      && getYear(appointment.date) === year
      && getMonth(appointment.date) + 1 === month
    ));
  }

  async findAllInDayFromProvider({
    day,
    year,
    month,
    provider_id,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    return this.appointments.filter((appointment) => (
      appointment.provider_id === provider_id
      && getDate(appointment.date) === day
      && getYear(appointment.date) === year
      && getMonth(appointment.date) + 1 === month
    ));
  }
}

export default FakeAppointmentsRepository;
