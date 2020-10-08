import { container } from 'tsyringe';

import MailProvider from './MailProvider/implementations';
import StorageProvider from './StorageProvider/implementations';
import IMailProvider from './MailProvider/models/IMailProvider';
import IStorageProvider from './StorageProvider/models/IStorageProvider';
import IMailTemplateProvider from './MailTemplateProvider/Models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/Implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  StorageProvider,
);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  new MailProvider(container.resolve(HandlebarsMailTemplateProvider)),
);
