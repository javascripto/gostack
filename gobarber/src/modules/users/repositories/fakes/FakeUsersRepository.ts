import { uuid } from 'uuidv4';

import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = []

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async create({ name, email, password }: ICreateUserDTO): Promise<User> {
    const user = new User();
    user.id = uuid();
    user.name = name;
    user.email = email;
    user.password = password;
    this.users.push(user);
    return user;
  }

  async save(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async findAllProviders({ except_user_id }: IFindAllProvidersDTO): Promise<User[]> {
    if (!except_user_id) {
      return this.users;
    }
    return this.users.filter((user) => user.id !== except_user_id);
  }
}

export default FakeUsersRepository;
