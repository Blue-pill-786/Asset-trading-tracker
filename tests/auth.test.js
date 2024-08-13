const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const mongoose = require('mongoose');

beforeAll(async () => {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
  // Cleanup database after each test
  await User.deleteMany({});
});

afterAll(async () => {
  // Close database connection and server after all tests
  await mongoose.connection.close();
});

let token;

beforeEach(async () => {
  // Create a user and get a token for authenticated tests
  await new User({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  }).save();

  const response = await request(app)
    .post('/auth/login')
    .send({
      username: 'testuser',
      password: 'password123'
    });
  token = response.body.token;
});

describe('Auth API', () => {
  test('should signup a user', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({
        username: 'newuser',
        email: 'new@example.com',
        password: 'newpassword'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User created successfully');
    expect(response.body.token).toBeDefined();
  });

  test('should fail signup with duplicate username', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        email: 'another@example.com',
        password: 'password123'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('User already exists');
  });

  test('should login a user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toBeDefined();
  });

  test('should fail login with invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword'
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Invalid credentials');
  });
});
