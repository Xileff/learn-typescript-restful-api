import { Address, Contact, User } from '@prisma/client';
import { prismaClient } from '../src/app/database';
import bcrypt from 'bcrypt';

export class UserTest {
  static async delete() {
    await prismaClient.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  static async create() {
    await prismaClient.user.create({
      data: {
        username: 'test',
        name: 'test',
        password: await bcrypt.hash('testtest', 10),
        token: 'test',
      },
    });
  }

  static async get(): Promise<User> {
    const user = await prismaClient.user.findFirst({
      where: {
        username: 'test',
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

export class ContactTest {
  static async deleteAll() {
    await prismaClient.contact.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  static async create() {
    await prismaClient.contact.create({
      data: {
        first_name: 'test',
        last_name: 'test',
        email: 'test@example.com',
        phone: '111122223333',
        username: 'test',
      },
    });
  }

  static async get(): Promise<Contact> {
    const result = await prismaClient.contact.findFirst({
      where: {
        username: 'test',
      },
    });

    if (!result) {
      throw new Error('Contact not found');
    }

    return result;
  }
}

export class AddressTest {
  static async deleteAll() {
    await prismaClient.address.deleteMany({
      where: {
        contact: {
          username: 'test',
        },
      },
    });

    /* equivalent query :
    DELETE FROM address
    WHERE contact_id IN (
      SELECT id FROM contact WHERE username = 'test'
    );
    */
  }

  static async create() {
    const contact = await ContactTest.get();
    await prismaClient.address.create({
      data: {
        street: 'Jalan',
        city: 'Kota',
        province: 'Provinsi',
        country: 'Negara',
        postal_code: '112233',
        contact_id: contact.id,
      },
    });
  }

  static async get(): Promise<Address> {
    const result = await prismaClient.address.findFirst({
      where: {
        contact: {
          username: 'test',
        },
      },
    });

    if (!result) {
      throw new Error('Address not found');
    }

    return result;
  }
}
