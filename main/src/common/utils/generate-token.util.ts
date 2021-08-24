import { randomBytes } from 'crypto';

export const generateToken = (size: number): string =>
  randomBytes(size).toString('hex');
