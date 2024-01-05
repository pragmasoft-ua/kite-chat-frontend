import {HttpError} from "./kite-types";

export async function downloadUrl(url: string): Promise<File> {
  const response = await fetch(url);
  if (response.ok) {
    const blob: Blob = await response.blob();
    const fileName = new URL(url).pathname;
    return new File([blob], fileName, {
      lastModified: Date.now(),
      type: blob.type,
    });
  } else {
    throw new HttpError(await response.text(), response.status);
  }
}

export async function upload(url: string, file: File): Promise<void> {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });
  if (!response.ok) {
    throw new HttpError(await response.text(), response.status);
  }
}