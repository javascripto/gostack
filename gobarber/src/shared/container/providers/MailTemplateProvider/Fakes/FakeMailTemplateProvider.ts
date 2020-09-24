import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from '../Models/IMailTemplateProvider';

export default class FakeMailTemplateProvider implements IMailTemplateProvider {
  async parse(data: IParseMailTemplateDTO): Promise<string> {
    return data.template;
  }
}
