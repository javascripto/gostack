import mailConfig from '@config/mail';
import SESMailProvider from './SESMailProvider';
import EtherealMailProvider from './EtherealMailProvider';

const MailProvider = {
  ses: SESMailProvider,
  ethereal: EtherealMailProvider,
};

export default MailProvider[mailConfig.driver];
