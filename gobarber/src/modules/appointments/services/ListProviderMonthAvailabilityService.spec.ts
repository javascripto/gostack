import 'reflect-metadata';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

describe('ListProviderMonthAvailabilityService', () => {
  let appointmentsRepository: FakeAppointmentsRepository;
  let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      appointmentsRepository,
    );
  });

  it('should be able to list the month availability from providers', async () => {
    const appointmentsOfDay20From8To17 = [];

    for (let dayHour = 8; dayHour <= 17; dayHour += 1) {
      appointmentsOfDay20From8To17.push(appointmentsRepository.create({
        user_id: 'fake-user-id',
        provider_id: 'fake-user-id',
        date: new Date(2020, 4, 20, dayHour, 0, 0),
      }));
    }

    await Promise.all(appointmentsOfDay20From8To17);

    await appointmentsRepository.create({
      user_id: 'fake-user-id',
      provider_id: 'fake-user-id',
      date: new Date(2020, 4, 20, 10, 0, 0),
    });
    await appointmentsRepository.create({
      user_id: 'fake-user-id',
      provider_id: 'fake-user-id',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'fake-user-id',
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(expect.arrayContaining([
      { day: 19, available: true },
      { day: 20, available: false },
      { day: 21, available: true },
      { day: 22, available: true },
    ]));
  });
});
