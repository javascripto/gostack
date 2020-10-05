import 'reflect-metadata';

import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

describe('ListProviderDayAvailabilityService', () => {
  let appointmentsRepository: FakeAppointmentsRepository;
  let listProviderDayAvailability: ListProviderDayAvailabilityService;

  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      appointmentsRepository,
    );
  });

  it('should be able to list the day availability from providers', async () => {
    await appointmentsRepository.create({
      user_id: 'fake-user-id',
      provider_id: 'fake-user-id',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await appointmentsRepository.create({
      user_id: 'fake-user-id',
      provider_id: 'fake-user-id',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    jest.spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 20, 11).getTime());

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'fake-user-id',
      day: 20,
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(expect.arrayContaining([
      { hour: 8, available: false },
      { hour: 9, available: false },
      { hour: 10, available: false },
      { hour: 11, available: false },
      { hour: 14, available: false },
      { hour: 13, available: true },
      { hour: 15, available: false },
      { hour: 16, available: true },
    ]));
  });
});
