import supertest from 'supertest';
import { ContactTest, UserTest } from './test-util';
import { web } from '../src/app/web';
import { logger } from '../src/app/logging';

describe('POST /api/contacts', () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should create new contact', async () => {
    const response = await supertest(web)
      .post('/api/contacts')
      .set('X-API-TOKEN', 'test')
      .send({
        firstName: 'Felix',
        lastName: 'Example',
        email: 'felix@example.com',
        phone: '111122223333',
      });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.firstName).toBe('Felix');
    expect(response.body.data.lastName).toBe('Example');
    expect(response.body.data.email).toBe('felix@example.com');
    expect(response.body.data.phone).toBe('111122223333');
  });

  it('should reject invalid contact', async () => {
    const response = await supertest(web)
      .post('/api/contacts')
      .set('X-API-TOKEN', 'test')
      .send({
        firstName: '',
        lastName: '',
        email: 'felix',
        phone:
          '111122223333111122223333111122223333111122223333111122223333111122223333',
      });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe('GET /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should be able to get contact', async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id}`)
      .set('X-API-TOKEN', 'test');

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBe(contact.id);
    expect(response.body.data.firstName).toBe(contact.first_name);
    expect(response.body.data.lastName).toBe(contact.last_name);
    expect(response.body.data.email).toBe(contact.email);
    expect(response.body.data.phone).toBe(contact.phone);
  });

  it('should throw 404 if contact not found', async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id + 1}`)
      .set('X-API-TOKEN', 'test');

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe('PUT /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should update contact', async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .put(`/api/contacts/${contact.id}`)
      .set('X-API-TOKEN', 'test')
      .send({
        firstName: 'Yuuta',
        lastName: 'Okkotsu',
        email: 'yuta@jjk.com',
        phone: '444433332222',
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBe(contact.id);
    expect(response.body.data.firstName).toBe('Yuuta');
    expect(response.body.data.lastName).toBe('Okkotsu');
    expect(response.body.data.email).toBe('yuta@jjk.com');
    expect(response.body.data.phone).toBe('444433332222');
  });

  it('should reject update if invalid request', async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .put(`/api/contacts/${contact.id}`)
      .set('X-API-TOKEN', 'test')
      .send({
        firstName: '',
        lastName: '',
        email: 'yuta',
        phone: '',
      });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});
