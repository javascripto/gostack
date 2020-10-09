import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

describe('ListProvidersService', () => {
  let fakeCacheProvider: FakeCacheProvider;
  let usersRepository: FakeUsersRepository;
  let listProvidersService: ListProvidersService;

  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProvidersService = new ListProvidersService(
      usersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const user1 = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const user2 = await usersRepository.create({
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123456',
    });
    const loggedUser = await usersRepository.create({
      name: 'John Qua',
      email: 'johnqua@example.com',
      password: '123456',
    });
    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });
    expect(providers).not.toContain(loggedUser);
    expect(providers).toEqual([user1, user2]);
  });
});
