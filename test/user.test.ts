import supertest from 'supertest';
import { web } from '../src/app/web';
import { logger } from '../src/app/logging';
import { UserTest } from './test-util';

describe('POST /api/users', () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  it('should reject invalid request', async () => {
    const response = await supertest(web).post('/api/users').send({
      username: '',
      password: '',
      name: '',
    });

    logger.debug(response.body.errors);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should accept valid request', async () => {
    const response = await supertest(web).post('/api/users').send({
      username: 'test',
      password: 'rahasia123',
      name: 'test',
    });

    logger.debug(response.body);

    expect(response.status).toBe(201);
    expect(response.body.errors).not.toBeDefined();
  });
});
