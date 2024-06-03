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
        street: 'Jalan apa',
        city: 'Kota apa',
        province: 'Provinsi apa',
        country: 'Negara apa',
        postalCode: '112233',
      });

    logger.debug(response.body);

    expect(response.status).toBe(201);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.street).toBe('Jalan apa');
    expect(response.body.data.city).toBe('Kota apa');
    expect(response.body.data.province).toBe('Provinsi apa');
    expect(response.body.data.country).toBe('Negara apa');
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
