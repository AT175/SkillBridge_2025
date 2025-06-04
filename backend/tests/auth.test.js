import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

const mockCreate = jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com', role: 'volunteer' });
const mockFindOne = jest.fn().mockResolvedValue({ id: 1, email: 'login@example.com', password: 'hashed', role: 'volunteer' });

jest.unstable_mockModule('../src/models/User.js', () => ({
  default: {
    create: mockCreate,
    findOne: mockFindOne
  }
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: {
    hash: async () => 'hashed',
    compare: async () => true
  }
}));

process.env.JWT_SECRET = 'testsecret';

const authRoutesModule = await import('../src/routes/auth.js');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutesModule.default);

test('POST /api/auth/register returns 201', async () => {
  const res = await request(app).post('/api/auth/register').send({
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    password: 'password',
    role: 'volunteer'
  });
  expect(res.status).toBe(201);
  expect(mockCreate).toHaveBeenCalled();
});

test('POST /api/auth/login returns 200', async () => {
  const res = await request(app).post('/api/auth/login').send({
    email: 'login@example.com',
    password: 'password'
  });
  expect(res.status).toBe(200);
  expect(mockFindOne).toHaveBeenCalled();
});
