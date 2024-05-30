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

describe('POST /api/users/login', () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it('should be able to login', async () => {
    const response = await supertest(web).post('/api/users/login').send({
      username: 'test',
      password: 'testtest',
    });

    logger.debug('RESPONSE BODY : ', response.body);
    expect(response.status).toBe(201);
    expect(response.body.data.username).toBe('test');
    expect(response.body.data.name).toBe('test');
    expect(response.body.data.token).toBeDefined();
  });

  it('should reject login if username is wrong', async () => {
    const response = await supertest(web).post('/api/users/login').send({
      username: 'palabapakkau',
      password: 'testtest',
    });

    logger.debug('RESPONSE BODY : ', response.body);
    expect(response.status).toBe(401);
    expect(response.body.data).not.toBeDefined();
    expect(response.body.errors).toBeDefined();
  });

  it('should reject login if password is wrong', async () => {
    const response = await supertest(web).post('/api/users/login').send({
      username: 'test',
      password: 'palabapakkau',
    });

    logger.debug('RESPONSE BODY : ', response.body);
    expect(response.status).toBe(401);
    expect(response.body.data).not.toBeDefined();
    expect(response.body.errors).toBeDefined();
  });
});
