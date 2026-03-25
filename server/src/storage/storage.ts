import { uploadToR2, deleteFromR2 } from './r2/r2.storage.js';
import { uploadToLocal, deleteFromLocal } from './local/local.storage.js';

const isDev = process.env.NODE_ENV === 'development';

export const uploadFile = async (
  fileBuffer: Buffer,
  key: string,
  contentType: string
): Promise<string> => {
  if (isDev) {
    return uploadToLocal(fileBuffer, key);
  }
  return uploadToR2(key, fileBuffer, contentType);
};

export const deleteFile = async (fileKeyOrUrl: string): Promise<void> => {
  if (isDev) {
    return deleteFromLocal(fileKeyOrUrl);
  }
  return deleteFromR2(fileKeyOrUrl);
};
