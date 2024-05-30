import supertest from 'supertest';
import { web } from '../src/app/web';
import { logger } from '../src/app/logging';
import { UserTest } from './test-util';
import bcrypt from 'bcrypt';

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

describe('GET /api/users/current', () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it('should get current user if token is valid', async () => {
    const response = await supertest(web)
      .get('/api/users/current')
      .set('X-API-TOKEN', 'test');

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.name).toBe('test');
    expect(response.body.data.username).toBe('test');
  });

  it('should reject get current user if token is invalid', async () => {
    const response = await supertest(web)
      .get('/api/users/current')
      .set('X-API-TOKEN', 'salah');

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.data).not.toBeDefined();
    expect(response.body.errors).toBeDefined();
  });
});

describe('PATCH /api/users/current', () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it('should reject update if request has no auth header', async () => {
    const response = await supertest(web).patch('/api/users/current').send({
      name: 'test1',
      password: '11111111',
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it('should reject update if token is invalid', async () => {
    const response = await supertest(web)
      .patch('/api/users/current')
      .set('X-API-TOKEN', 'fake token')
      .send({
        name: 'test1',
        password: '11111111',
      });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it('should reject update if request is invalid', async () => {
    const response = await supertest(web)
      .patch('/api/users/current')
      .set('X-API-TOKEN', 'test')
      .send({
        name: '',
        password: '',
      });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should accept update name only', async () => {
    const response = await supertest(web)
      .patch('/api/users/current')
      .set('X-API-TOKEN', 'test')
      .send({
        name: 'test1',
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.name).toBe('test1');
    expect(response.body.data.username).toBe('test');
  });

  it('should accept update password only', async () => {
    const response = await supertest(web)
      .patch('/api/users/current')
      .set('X-API-TOKEN', 'test')
      .send({
        password: '22222222',
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();

    const user = await UserTest.get();
    expect(await bcrypt.compare('22222222', user.password)).toBe(true);
  });
});

describe('DELETE /api/users/current', () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it('should reject logout if not authenticated', async () => {
    const response = await supertest(web).delete('/api/users/current');

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.data).not.toBeDefined();
    expect(response.body.errors).toBeDefined();
  });

  it('should reject logout if token is invalid', async () => {
    const response = await supertest(web)
      .delete('/api/users/current')
      .set('X-API-TOKEN', 'fake token');

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.data).not.toBeDefined();
    expect(response.body.errors).toBeDefined();
  });

  it('should accept logout if token is valid', async () => {
    const response = await supertest(web)
      .delete('/api/users/current')
      .set('X-API-TOKEN', 'test');

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toBe('OK');

    const user = await UserTest.get();
    expect(user.token).toBeNull();
  });
});
