import { z } from 'zod';

export class ContactSchema {
  static readonly CREATE = z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100).optional(),
    email: z.string().min(1).max(100).optional(),
    phone: z.string().min(1).max(20).optional(),
  });

  static readonly UPDATE = z.object({
    id: z.number().positive(),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100).optional(),
    email: z.string().min(1).max(100).optional(),
    phone: z.string().min(1).max(20).optional(),
  });
}
