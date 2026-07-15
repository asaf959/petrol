import { BadRequestException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { extname, join, resolve } from 'path';
import { memoryStorage, Options } from 'multer';

const MAX_PDF_SIZE = 5 * 1024 * 1024;
const PDF_FILENAME = /^[0-9a-f-]{36}\.pdf$/i;

export const PDF_UPLOAD_DIRECTORY = resolve(
  process.env.UPLOAD_DIR || join(process.cwd(), 'uploads'),
  'fuel-records',
);

export const PDF_UPLOAD_OPTIONS: Options = {
  storage: memoryStorage(),
  limits: {
    fileSize: MAX_PDF_SIZE,
    files: 1,
  },
  fileFilter: (_request, file, callback) => {
    const isPdf =
      file.mimetype === 'application/pdf' &&
      extname(file.originalname).toLowerCase() === '.pdf';

    if (!isPdf) {
      callback(new BadRequestException('Only PDF files are allowed'));
      return;
    }

    callback(null, true);
  },
};

export function savePdf(buffer: Buffer): string {
  if (buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
    throw new BadRequestException('The uploaded file is not a valid PDF');
  }

  mkdirSync(PDF_UPLOAD_DIRECTORY, { recursive: true });
  const filename = `${randomUUID()}.pdf`;
  writeFileSync(join(PDF_UPLOAD_DIRECTORY, filename), buffer, { mode: 0o600 });
  return filename;
}

export function getPdfPath(filename: string): string {
  if (!PDF_FILENAME.test(filename)) {
    throw new NotFoundException('PDF document not found');
  }

  const filePath = join(PDF_UPLOAD_DIRECTORY, filename);
  if (!existsSync(filePath)) {
    throw new NotFoundException('PDF document not found');
  }

  return filePath;
}

export function removePdf(filename?: string | null): void {
  if (!filename || !PDF_FILENAME.test(filename)) return;

  const filePath = join(PDF_UPLOAD_DIRECTORY, filename);
  if (existsSync(filePath)) {
    unlinkSync(filePath);
  }
}
