import { uuid } from 'uuidv4';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUserTokensRepository from '../IUserTokensRepository';

class FakeUserTokensRepository implements IUserTokensRepository {
  private tokens: UserToken[] = [];

  async generate(user_id: string): Promise<UserToken> {
    const token = new UserToken();
    Object.assign<UserToken, Partial<UserToken>>(token, {
      id: uuid(),
      token: uuid(),
      user_id,
    });
    this.tokens.push(token);
    return token;
  }
}

export default FakeUserTokensRepository;
