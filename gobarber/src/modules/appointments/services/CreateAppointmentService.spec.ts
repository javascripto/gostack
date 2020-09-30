import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

describe('CreateAppointmentService', () => {
  let createAppointment: CreateAppointmentService;
  let appointmentsRepository: FakeAppointmentsRepository;

  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(appointmentsRepository);
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({ date: new Date(), provider_id: 'fake-id' });
    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const date = new Date();
    await createAppointment.execute({ date, provider_id: 'fake-id' });
    await expect(createAppointment.execute({ date, provider_id: 'fake-id-2' }))
      .rejects.toBeInstanceOf(AppError);
  });
});
