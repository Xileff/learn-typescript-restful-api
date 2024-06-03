import { Address } from '@prisma/client';

export type AddressResponse = {
  id: number;
  street?: string | null;
  city?: string | null;
  province?: string | null;
  country: string;
  postalCode: string;
};

export type CreateAddressRequest = {
  contactId: number;
  street?: string | null;
  city?: string | null;
  province?: string | null;
  country: string;
  postalCode: string;
};

export function toAddressResponse(address: Address): AddressResponse {
  return {
    id: address.id,
    street: address.street,
    city: address.city,
    province: address.province,
    country: address.country,
    postalCode: address.postal_code,
  };
}
