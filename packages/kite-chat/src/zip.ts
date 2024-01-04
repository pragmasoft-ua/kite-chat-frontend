import type JSZip from 'jszip';

const JSZIP_CDN = 'https://cdn.jsdelivr.net/npm/jszip/dist/jszip.min.js';

export async function zipFiles(files: File[], resultType = "application/zip", timestamp = new Date()): Promise<File> {
  // Import JSZip module dynamically
  await import(/* @vite-ignore */ JSZIP_CDN);

  const extendedSelf  = self as unknown as typeof self & {JSZip: JSZip};
  const zip: JSZip = new extendedSelf.JSZip();

  files.forEach((file) => {
    zip.file(file.name, file);
  });

  const zipFileName = files.length === 1 
    ? `${files[0].name.replace(/\.[^/.]+$/, '')}.zip`
    : `${timestamp.toISOString()}.zip`;
  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 0 } });
  return new File([blob], zipFileName, {type: resultType});
}