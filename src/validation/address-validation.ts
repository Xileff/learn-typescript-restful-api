import { z } from 'zod';

export class AddressValidation {
  static readonly CREATE = z.object({
    contactId: z.number().positive(),
    street: z.string().min(1).max(255).optional(),
    city: z.string().min(1).max(100).optional(),
    province: z.string().min(1).max(100).optional(),
    country: z.string().min(1).max(100),
    postalCode: z.string().min(1).max(10),
  });

  static readonly GET = z.object({
    contactId: z.number().positive(),
    addressId: z.number().positive(),
  });

  static readonly UPDATE = z.object({
    id: z.number().positive(),
    contactId: z.number().positive(),
    street: z.string().min(1).max(255).optional(),
    city: z.string().min(1).max(100).optional(),
    province: z.string().min(1).max(100).optional(),
    country: z.string().min(1).max(100),
    postalCode: z.string().min(1).max(10),
  });
}
