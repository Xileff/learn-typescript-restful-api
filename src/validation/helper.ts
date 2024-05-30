import { ZodType } from 'zod';

export class ValidationHelper {
  static validate<T>(schema: ZodType, data: T): T {
    // validate anything (T), then if success the data will be returned
    return schema.parse(data);
  }
}
