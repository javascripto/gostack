import uploadConfig from '@config/upload';
import S3StorageProvider from './S3StorageProvider';
import DiskStorageProvider from './DiskStorageProvider';

const StorageProvider = {
  s3: S3StorageProvider,
  disk: DiskStorageProvider,
};

export default StorageProvider[uploadConfig.driver];
