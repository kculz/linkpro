import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_UPLOAD_DIR = process.env.LOCAL_UPLOAD_DIR || 'uploads';

export const uploadToLocal = async (
  fileBuffer: Buffer,
  originalName: string
): Promise<string> => {
  const ext = path.extname(originalName);
  const filename = `${uuidv4()}${ext}`;
  const dest = path.join(LOCAL_UPLOAD_DIR, filename);
  fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
  fs.writeFileSync(dest, fileBuffer);
  return `/uploads/${filename}`;
};

export const deleteFromLocal = async (fileUrl: string): Promise<void> => {
  const filePath = path.join(process.cwd(), fileUrl);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};
