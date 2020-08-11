import { container } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

container.registerSingleton<IAppointmentsRepository>(
  AppointmentsRepository.name,
  AppointmentsRepository,
);

container.registerSingleton<IUsersRepository>(
  UsersRepository.name,
  UsersRepository,
);
