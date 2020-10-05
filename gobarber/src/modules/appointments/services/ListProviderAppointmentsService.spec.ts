import 'reflect-metadata';

import ListProviderAppointments from './ListProviderAppointmentsService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

describe('ListProviderAppointments', () => {
  let appointmentsRepository: FakeAppointmentsRepository;
  let listProviderAppointments: ListProviderAppointments;

  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointments(
      appointmentsRepository,
    );
  });

  it('should be able to list the appointments from providers on specific day', async () => {
    const appointment1 = await appointmentsRepository.create({
      user_id: 'fake-user-id',
      provider_id: 'fake-provider-id',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });
    const appointment2 = await appointmentsRepository.create({
      user_id: 'fake-user-id',
      provider_id: 'fake-provider-id',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      day: 20,
      month: 5,
      year: 2020,
      provider_id: 'fake-provider-id',
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
