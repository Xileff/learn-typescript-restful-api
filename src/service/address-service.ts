import { Address, User } from '@prisma/client';
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
  toAddressResponse,
} from '../model/address-model';
import { ValidationHelper } from '../validation/helper';
import { AddressValidation } from '../validation/address-validation';
import { ContactService } from './contact-service';
import { prismaClient } from '../app/database';
import { ResponseError } from '../error/response-error';
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

  static async checkAddressMustExists(addressId: number, contactId: number): Promise<Address> {
    const address = await prismaClient.address.findFirst({
      where: {
        id: addressId,
        contact_id: contactId,
      },
    });

    if (!address) {
      throw new ResponseError(404, 'Address not found');
    }

    return address;
  }

  static async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    const getRequest = ValidationHelper.validate(AddressValidation.GET, request);
    await ContactService.checkContactMustExists(user.username, getRequest.contactId); // mencegah user ngambil data kontak yang bukan miliknya

    const address = await this.checkAddressMustExists(getRequest.addressId, getRequest.contactId);
    return toAddressResponse(address);
  }

  static async update(user: User, request: UpdateAddressRequest): Promise<AddressResponse> {
    const updateRequest = ValidationHelper.validate(AddressValidation.UPDATE, request);
    await ContactService.checkContactMustExists(user.username, updateRequest.contactId);
    await this.checkAddressMustExists(updateRequest.id, updateRequest.contactId);

    const address = await prismaClient.address.update({
      data: {
        street: updateRequest.street,
        city: updateRequest.city,
        province: updateRequest.province,
        country: updateRequest.country,
        postal_code: updateRequest.postalCode,
      },
      where: {
        id: updateRequest.id,
        contact_id: updateRequest.contactId,
      },
    });

    return toAddressResponse(address);
  }

  static async remove(user: User, request: RemoveAddressRequest): Promise<AddressResponse> {
    const removeRequest = ValidationHelper.validate(AddressValidation.REMOVE, request);
    await ContactService.checkContactMustExists(user.username, removeRequest.contactId);
    await this.checkAddressMustExists(removeRequest.addressId, removeRequest.contactId);

    const address = await prismaClient.address.delete({
      where: {
        id: removeRequest.addressId,
      },
    });

    return toAddressResponse(address);
  }
}
