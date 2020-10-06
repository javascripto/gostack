import { getMongoRepository, MongoRepository } from 'typeorm';

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Notification from '../schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
  private odmRepository: MongoRepository<Notification>

  constructor() {
    this.odmRepository = getMongoRepository(Notification, 'mongo');
  }

  async create({ content, recipient_id }: ICreateNotificationDTO): Promise<Notification> {
    const notification = await this.odmRepository.create({
      content,
      recipient_id,
    });
    return this.odmRepository.save(notification);
  }
}

export default NotificationsRepository;
