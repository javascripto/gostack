import { getRepository, Repository, Not } from 'typeorm';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  findById(id: string): Promise<User | undefined> {
    return this.ormRepository.findOne(id);
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.ormRepository.findOne({ where: { email } });
  }

  create({ name, email, password }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ name, email, password });
    return this.ormRepository.save(user);
  }

  save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  findAllProviders({ except_user_id }: IFindAllProvidersDTO): Promise<User[]> {
    if (!except_user_id) {
      return this.ormRepository.find();
    }
    return this.ormRepository.find({
      where: {
        id: Not(except_user_id),
      },
    });
  }
}

export default UsersRepository;
