import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '../../notifications/repositories/Fakes/FakeNotificationRepository';

describe('CreateAppointmentService', () => {
  let fakeCacheProvider: FakeCacheProvider;
  let createAppointment: CreateAppointmentService;
  let appointmentsRepository: FakeAppointmentsRepository;
  let notificationsRepository: FakeNotificationsRepository;

  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    notificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      appointmentsRepository,
      notificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    const appointment = await createAppointment.execute({
      user_id: 'fake-user-id',
      date: new Date(2020, 4, 10, 13),
      provider_id: 'fake-id',
    });
    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    const date = new Date(2020, 4, 10, 13);
    await createAppointment.execute({
      user_id: 'fake-user-id',
      date,
      provider_id: 'fake-id',
    });
    await expect(createAppointment.execute({
      user_id: 'fake-user-id',
      date,
      provider_id: 'fake-id-2',
    }))
      .rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    await expect(createAppointment.execute({
      date: new Date(2020, 4, 10, 11),
      user_id: 'user_id',
      provider_id: 'provider_id',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    await expect(createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: 'user_id',
      provider_id: 'user_id',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    await expect(createAppointment.execute({
      date: new Date(2020, 4, 11, 7),
      user_id: 'user_id',
      provider_id: 'provider_id',
    })).rejects.toBeInstanceOf(AppError);

    await expect(createAppointment.execute({
      date: new Date(2020, 4, 11, 18),
      user_id: 'user_id',
      provider_id: 'provider_id',
    })).rejects.toBeInstanceOf(AppError);
  });
});
