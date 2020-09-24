import ISendMailDTO from '../dtos/ISendMailDTO';

interface IMailProvider {
  sendMail(data: ISendMailDTO): Promise<void>
}

export default IMailProvider;

// Mandrill / Sparkport / Mailgun / Amazon SES / SMTP / Sendgrid
