import { ZodType, z } from 'zod';

export class UserSchema {
  static readonly REGISTER = z.object({
    username: z
      .string()
      .min(1, 'Username min 1 character')
      .max(100, 'Username max 100 characters'),
    password: z
      .string()
      .min(8, 'Password min 8 characters')
      .max(100, 'Password max 100 characters'),
    name: z
      .string()
      .min(1, 'Name min 1 character')
      .max(100, 'Name max 100 characters'),
  });

  static readonly LOGIN = z.object({
    username: z
      .string()
      .min(1, 'Username min 1 character')
      .max(100, 'Username max 100 characters'),
    password: z
      .string()
      .min(8, 'Password min 8 characters')
      .max(100, 'Password max 100 characters'),
  });

  static readonly UPDATE = z.object({
    name: z
      .string()
      .min(1, 'Username min 1 character')
      .max(100, 'Username max 100 characters')
      .optional(),
    password: z
      .string()
      .min(8, 'Password min 8 characters')
      .max(100, 'Password max 100 characters')
      .optional(),
  });
}
