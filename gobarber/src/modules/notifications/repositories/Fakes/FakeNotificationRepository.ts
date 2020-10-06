import { ObjectID } from 'mongodb';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Array<Notification> = [];

  async create({ content, recipient_id }: ICreateNotificationDTO): Promise<Notification> {
    const notification = Object.assign(new Notification(), {
      id: new ObjectID(),
      content,
      recipient_id,
    });
    this.notifications.push(notification);
    return notification;
  }
}

export default FakeNotificationsRepository;
