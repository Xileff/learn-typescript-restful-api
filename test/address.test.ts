import supertest from 'supertest';
import { AddressTest, ContactTest, UserTest } from './test-util';
import { web } from '../src/app/web';
import { logger } from '../src/app/logging';

describe('POST /api/contacts/:contactId/addresses', () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should be able to create address', async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set('X-API-TOKEN', 'test')
      .send({
        street: 'Jalan',
        city: 'Kota',
        province: 'Provinsi',
        country: 'Negara',
        postalCode: '112233',
      });

    logger.debug(response.body);

    expect(response.status).toBe(201);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.street).toBe('Jalan');
    expect(response.body.data.city).toBe('Kota');
    expect(response.body.data.province).toBe('Provinsi');
    expect(response.body.data.country).toBe('Negara');
    expect(response.body.data.postalCode).toBe('112233');
  });

  it('should reject invalid create address request', async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set('X-API-TOKEN', 'test')
      .send({
        street: 'Jalan apa',
        city: 'Kota apa',
        province: 'Provinsi apa',
        country: '',
        postalCode: '',
      });

    logger.debug(response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should reject create address if contact is not found', async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .post(`/api/contacts/${contact.id + 1}/addresses`)
      .set('X-API-TOKEN', 'test')
      .send({
        street: 'Jalan apa',
        city: 'Kota apa',
        province: 'Provinsi apa',
        country: 'Negara apa',
        postalCode: '112233',
      });

    logger.debug(response.body);

    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should be able to get address', async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set('X-API-TOKEN', 'test');

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.street).toBe(address.street);
    expect(response.body.data.city).toBe(address.city);
    expect(response.body.data.province).toBe(address.province);
    expect(response.body.data.country).toBe(address.country);
    expect(response.body.data.postalCode).toBe(address.postal_code);
  });

  it('should reject get address if address is not found', async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
      .set('X-API-TOKEN', 'test');

    logger.debug(response.body);

    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });

  it('should reject get address if contact is not found', async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
      .set('X-API-TOKEN', 'test');

    logger.debug(response.body);

    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should be able to update address', async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
      .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set('X-API-TOKEN', 'test')
      .send({
        street: 'Jalan updated',
        city: 'Kota updated',
        province: 'Provinsi updated',
        country: 'Negara updated',
        postalCode: '332211',
      });

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBe(address.id);
    expect(response.body.data.street).toBe('Jalan updated');
    expect(response.body.data.city).toBe('Kota updated');
    expect(response.body.data.province).toBe('Provinsi updated');
    expect(response.body.data.country).toBe('Negara updated');
    expect(response.body.data.postalCode).toBe('332211');
  });

  it('should reject update if request is invalid', async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
      .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set('X-API-TOKEN', 'test')
      .send({
        street: 'Jalan updated',
        city: 'Kota updated',
        province: 'Provinsi updated',
        country: '',
        postalCode: '',
      });

    logger.debug(response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should reject update if contact is not found', async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
      .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
      .set('X-API-TOKEN', 'test')
      .send({
        street: 'Jalan updated',
        city: 'Kota updated',
        province: 'Provinsi updated',
        country: 'Negara updated',
        postalCode: '332211',
      });

    logger.debug(response.body);

    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });

  it('should reject update if address is not found', async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
      .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
      .set('X-API-TOKEN', 'test')
      .send({
        street: 'Jalan updated',
        city: 'Kota updated',
        province: 'Provinsi updated',
        country: 'Negara updated',
        postalCode: '332211',
      });

    logger.debug(response.body);

    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should be able to delete address', async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set('X-API-TOKEN', 'test');

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toBe('OK');
  });

  it('should reject delete address if address is not found', async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
      .set('X-API-TOKEN', 'test');

    logger.debug(response.body);

    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });

  it('should reject delete address if contact is not found', async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
      .set('X-API-TOKEN', 'test');

    logger.debug(response.body);

    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});
