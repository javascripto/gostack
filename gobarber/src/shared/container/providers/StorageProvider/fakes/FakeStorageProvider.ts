import IStorageProvider from '../models/IStorageProvider';

class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  async saveFile(file: string): Promise<string> {
    this.storage.push(file);
    return file;
  }

  async deleteFile(file: string): Promise<void> {
    const findIndex = this.storage.findIndex((fileName) => fileName === file);
    if (findIndex !== -1) {
      this.storage.splice(findIndex, 1);
    }
  }
}

export default FakeStorageProvider;
