import { Contact, User } from '@prisma/client';
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
  toContactResponse,
} from '../model/contact-model';
import { ContactSchema } from '../validation/contact-validation';
import { ValidationHelper } from '../validation/helper';
import { prismaClient } from '../app/database';
import { ResponseError } from '../error/response-error';
import { Pageable } from '../model/page';

export class ContactService {
  static async create(user: User, request: CreateContactRequest): Promise<ContactResponse> {
    const createRequest = ValidationHelper.validate(ContactSchema.CREATE, request);

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

  static async checkContactMustExists(username: string, id: number): Promise<Contact> {
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

  static async update(user: User, request: UpdateContactRequest): Promise<ContactResponse> {
    const updateRequest = ValidationHelper.validate(ContactSchema.UPDATE, request);

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

  static async search(
    user: User,
    request: SearchContactRequest,
  ): Promise<Pageable<ContactResponse>> {
    const searchRequest = ValidationHelper.validate(ContactSchema.SEARCH, request);

    const filters = [];

    // query by LIKE first name OR last name
    if (searchRequest.name) {
      filters.push({
        OR: [
          {
            first_name: {
              contains: searchRequest.name,
            },
            last_name: {
              contains: searchRequest.name,
            },
          },
        ],
      });
    }

    // query by LIKE email
    if (searchRequest.email) {
      filters.push({
        email: {
          contains: searchRequest.email,
        },
      });
    }

    // query by LIKE phone
    if (searchRequest.phone) {
      filters.push({
        phone: {
          contains: searchRequest.phone,
        },
      });
    }

    const contacts = await prismaClient.contact.findMany({
      where: {
        username: user.username,
        AND: filters,
      },
      take: searchRequest.size,
      skip: (searchRequest.page - 1) * searchRequest.size, // misal skrg halaman 2, per halaman 10 data. berarti skip (2 - 1) * 10 = 10 data
    });

    const total = await prismaClient.contact.count({
      where: {
        username: user.username,
        AND: filters,
      },
    }); // untuk tau ada berapa total data sebelum di-paginate (buat itung halaman)

    return {
      data: contacts.map((contact) => toContactResponse(contact)),
      paging: {
        currentPage: searchRequest.page,
        size: searchRequest.size,
        totalPage: Math.ceil(total / searchRequest.size), // misal total 91 data, per page mau 10 data. berarti total halaman = 91 / 10 -> 10 halaman
      },
    };
  }
}
