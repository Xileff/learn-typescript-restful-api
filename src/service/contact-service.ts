import { User } from '@prisma/client';
import {
  ContactResponse,
  CreateContactRequest,
  toContactResponse,
} from '../model/contact-model';
import { ContactSchema } from '../validation/contact-validation';
import { ValidationHelper } from '../validation/helper';
import { prismaClient } from '../app/database';
import { ResponseError } from '../error/response-error';

export class ContactService {
  static async create(
    user: User,
    request: CreateContactRequest,
  ): Promise<ContactResponse> {
    const createRequest = ValidationHelper.validate(
      ContactSchema.CREATE,
      request,
    );

    const contact = await prismaClient.contact.create({
      data: {
        first_name: createRequest.firstName,
        last_name: createRequest.lastName,
        email: createRequest.email,
        phone: createRequest.phone,
        username: user.username,
      },
    });

    return toContactResponse(contact);
  }

  static async get(user: User, id: number): Promise<ContactResponse> {
    const result = await prismaClient.contact.findFirst({
      where: {
        id,
        username: user.username,
      },
    });

    if (!result) {
      throw new ResponseError(404, 'Contact not found');
    }

    return toContactResponse(result);
  }
}
