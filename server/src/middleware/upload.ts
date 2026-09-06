import multer from 'multer';
import { v4 as uuid } from 'uuid';

const MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

const storage = multer.diskStorage({
  destination: (_req: any, _file: any, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/products');
  },
  filename: (_req: any, file: any, cb: (error: Error | null, filename: string) => void) => {
    const ext = file.originalname.split('.').pop() || 'jpg';
    cb(null, `${uuid()}.${ext}`);
  },
});

const fileFilter = (_req: any, file: any, cb: (error: Error | null, acceptFile?: boolean) => void) => {
  if (MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, GIF, and SVG are allowed.'));
  }
};

export const uploadProductImage = multer({ storage, fileFilter }).single('image');
