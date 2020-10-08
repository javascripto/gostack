import fs from 'fs';
import mime from 'mime';
import path from 'path';
import aws, { S3 } from 'aws-sdk';

import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  private client: S3

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }

  async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const ContentType = mime.getType(originalPath)!;
    const fileContent = await fs.promises.readFile(originalPath);

    await this.client.putObject({
      Bucket: uploadConfig.config.aws.bucket,
      Key: file,
      ACL: 'public-read',
      Body: fileContent,
      ContentType,
    }).promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  async deleteFile(file: string): Promise<void> {
    await this.client.deleteObject({
      Bucket: 'app-gobarber-javascripto',
      Key: file,
    }).promise();
  }
}

export default S3StorageProvider;
