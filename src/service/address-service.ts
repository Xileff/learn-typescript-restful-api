import { User } from '@prisma/client';
import { AddressResponse, CreateAddressRequest, toAddressResponse } from '../model/address-model';
import { ValidationHelper } from '../validation/helper';
import { AddressValidation } from '../validation/address-validation';
import { ContactService } from './contact-service';
import { prismaClient } from '../app/database';
import { add } from 'winston';

export class AddressService {
  static async create(user: User, request: CreateAddressRequest): Promise<AddressResponse> {
    const createRequest = ValidationHelper.validate(AddressValidation.CREATE, request);
    await ContactService.checkContactMustExists(user.username, request.contactId); // cek dulu, apakah user punya kontak yang mau dikasih alamat ini?

    const address = await prismaClient.address.create({
      data: {
        contact_id: createRequest.contactId,
        street: createRequest.street,
        city: createRequest.city,
        province: createRequest.province,
        country: createRequest.country,
        postal_code: createRequest.postalCode,
      },
    });

    return toAddressResponse(address);
  }
}
