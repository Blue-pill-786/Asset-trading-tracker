const request = require('supertest');
const app = require('../app'); // Ensure this points to your app setup file

describe('User Signup and Login', () => {
  let token;

  test('should successfully sign up a new user', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({ username: 'testuser', password: 'password123' });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'User created successfully');
  });

  test('should successfully log in with valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'password123' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
  });

  test('should return error for duplicate username', async () => {
    await request(app)
      .post('/auth/signup')
      .send({ username: 'testuser', password: 'password123' });
    
    const response = await request(app)
      .post('/auth/signup')
      .send({ username: 'testuser', password: 'password123' });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Username already exists');
  });

  test('should return error for invalid login credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'wrongpassword' });
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });
});
