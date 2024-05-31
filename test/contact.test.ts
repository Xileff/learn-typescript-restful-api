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
