import { Contact, User } from '@prisma/client';
import {
  ContactResponse,
  CreateContactRequest,
  UpdateContactRequest,
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

  static async checkContactMustExists(
    username: string,
    id: number,
  ): Promise<Contact> {
    const contact = await prismaClient.contact.findFirst({
      where: {
        id,
        username,
      },
    });

    if (!contact) {
      throw new ResponseError(404, 'Contact not found.');
    }

    return contact;
  }

  static async get(user: User, id: number): Promise<ContactResponse> {
    const result = await this.checkContactMustExists(user.username, id);
    return toContactResponse(result);
  }

  static async update(
    user: User,
    request: UpdateContactRequest,
  ): Promise<ContactResponse> {
    const updateRequest = ValidationHelper.validate(
      ContactSchema.UPDATE,
      request,
    );

    await this.checkContactMustExists(user.username, updateRequest.id);

    const contact = await prismaClient.contact.update({
      where: {
        id: updateRequest.id,
        username: user.username,
      },
      data: {
        first_name: updateRequest.firstName,
        last_name: updateRequest.lastName,
        email: updateRequest.email,
        phone: updateRequest.phone,
      },
    });

    return toContactResponse(contact);
  }

  static async remove(user: User, id: number): Promise<ContactResponse> {
    await this.checkContactMustExists(user.username, id);

    const contact = await prismaClient.contact.delete({
      where: {
        id,
        username: user.username,
      },
    });

    return toContactResponse(contact);
  }
}
