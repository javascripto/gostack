interface IMailProvider {
  sendMail(to: string, body: string): Promise<void>
}

export default IMailProvider;

// Mandrill / Sparkport / Mailgun / Amazon SES / SMTP / Sendgrid
