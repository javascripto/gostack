import ISendMailDTO from '../dtos/ISendMailDTO';

interface IMailProvider {
  sendMail(data: ISendMailDTO): Promise<void>
}

export default IMailProvider;

// Soluções de e-mail transacional:
//  Mandrill / Sparkpost / Mailgun / Amazon SES / SMTP / Sendgrid / Mailchimp
