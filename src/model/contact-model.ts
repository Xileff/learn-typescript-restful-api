import { Contact } from '@prisma/client';

export type ContactResponse = {
  id: number;
  firstName: string;
  lastName?: string | null; // optional field, but when filled must be either string OR null
  email?: string | null; // in prisma and mysql, optional means nullable (not undefined)
  phone?: string | null;
};

export type CreateContactRequest = {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export function toContactResponse(contact: Contact): ContactResponse {
  return {
    id: contact.id,
    firstName: contact.first_name,
    lastName: contact.last_name,
    email: contact.email,
    phone: contact.phone,
  };
}
