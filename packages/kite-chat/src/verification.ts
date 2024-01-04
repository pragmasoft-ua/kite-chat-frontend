import {
  FileVerification,
  PlainTextVerification,
} from './kite-types';

export const SUPPORTED_FILE_FORMATS = {
  "application/pdf": 20 * 1024 * 1024, // 20MB
  "application/zip": 20 * 1024 * 1024,
  "application/x-zip-compressed": 20 * 1024 * 1024,
  "image/jpeg": 5 * 1024 * 1024, // 5MB
  "image/png": 5 * 1024 * 1024,
  "image/gif": 20 * 1024 * 1024,
  "video/mp4": 20 * 1024 * 1024,
  "image/webp": 20 * 1024 * 1024,
};

export const PLAIN_MAX_SIZE = 4 * 1024; // 4KB

export function verifyFile(file: File): FileVerification {
  const maxSize = SUPPORTED_FILE_FORMATS[file.type as keyof typeof SUPPORTED_FILE_FORMATS];

  if (!maxSize) {
    return FileVerification.UNSUPPORTED_TYPE;
  }

  if (file.size > maxSize) {
    return FileVerification.EXCEED_SIZE;
  }

  return FileVerification.SUCCEED;
}

export function verifyPlainText(text: string): PlainTextVerification {
  const blob = new Blob([text]);
  
  if (blob.size > PLAIN_MAX_SIZE) {
    return PlainTextVerification.EXCEED_SIZE;
  }

  return PlainTextVerification.SUCCEED;
}