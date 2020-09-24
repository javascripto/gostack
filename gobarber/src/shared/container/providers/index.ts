import { container } from 'tsyringe';

import IMailProvider from './MailProvider/models/IMailProvider';
import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import IMailTemplateProvider from './MailTemplateProvider/Models/IMailTemplateProvider';
import HandlebarsMailTemplateprovider from './MailTemplateProvider/Implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateprovider,
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  new EtherealMailProvider(
    container.resolve(HandlebarsMailTemplateprovider),
  ),
);
