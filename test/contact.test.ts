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
    const response = await supertest(web).post('/api/contacts').set('X-API-TOKEN', 'test').send({
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
    const response = await supertest(web).post('/api/contacts').set('X-API-TOKEN', 'test').send({
      firstName: '',
      lastName: '',
      email: 'felix',
      phone: '111122223333111122223333111122223333111122223333111122223333111122223333',
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

describe('DELETE /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should be able to delete contact', async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id}`)
      .set('X-API-TOKEN', 'test');

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBe('OK');
  });

  it('should reject delete if contact not found', async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id + 1}`)
      .set('X-API-TOKEN', 'test');

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });

  it('should reject unauthenticated delete', async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web).delete(`/api/contacts/${contact.id}`);

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it('should reject unauthorized delete', async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id}`)
      .set('X-API-TOKEN', 'fake token');

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe('GET /api/contacts', () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it('should be able to search contacts', async () => {
    const response = await supertest(web).get('/api/contacts').set('X-API-TOKEN', 'test');

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.currentPage).toBe(1);
    expect(response.body.paging.totalPage).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it('should be able to search contacts using name', async () => {
    const response = await supertest(web)
      .get('/api/contacts')
      .query({
        name: 'est',
      })
      .set('X-API-TOKEN', 'test');

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.currentPage).toBe(1);
    expect(response.body.paging.totalPage).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it('should be able to search contacts using phone', async () => {
    const response = await supertest(web)
      .get('/api/contacts')
      .query({
        phone: '112222',
      })
      .set('X-API-TOKEN', 'test');

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.currentPage).toBe(1);
    expect(response.body.paging.totalPage).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it('should be able to search contacts using email', async () => {
    const response = await supertest(web)
      .get('/api/contacts')
      .query({
        email: '@example',
      })
      .set('X-API-TOKEN', 'test');

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.currentPage).toBe(1);
    expect(response.body.paging.totalPage).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it('should be able to search contacts with no result', async () => {
    const response = await supertest(web)
      .get('/api/contacts')
      .query({
        name: 'salah',
      })
      .set('X-API-TOKEN', 'test');

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBe(0);
    expect(response.body.paging.currentPage).toBe(1); // default from controller
    expect(response.body.paging.totalPage).toBe(0); // from count query
    expect(response.body.paging.size).toBe(10); // default from controller
  });

  it('should be able to search contacts with paging', async () => {
    const response = await supertest(web)
      .get('/api/contacts')
      .query({
        page: 2,
        size: 1,
      })
      .set('X-API-TOKEN', 'test');

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBe(0);
    expect(response.body.paging.currentPage).toBe(2); // default from controller
    expect(response.body.paging.totalPage).toBe(1); // from count query
    expect(response.body.paging.size).toBe(1); // default from controller
  });
});
