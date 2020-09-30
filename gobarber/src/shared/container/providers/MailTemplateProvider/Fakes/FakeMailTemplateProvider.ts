import IMailTemplateProvider from '../Models/IMailTemplateProvider';

export default class FakeMailTemplateProvider implements IMailTemplateProvider {
  async parse(): Promise<string> {
    return 'Mail content';
  }
}
