const request = require('supertest');
const app = require('../app'); // Adjust the path according to your file structure

let token;

beforeAll(async () => {
  // You may need to sign up a user to obtain a token if your tests depend on authentication
  const response = await request(app)
    .post('/signup')
    .send({ username: 'testuser', password: 'testpass' });
  token = response.body.token; // Adjust according to your actual response structure
});

beforeEach(async () => {
  // Clear out the database collections
  await mongoose.connection.db.dropDatabase();
});

test('should signup a user', async () => {
  const response = await request(app)
    .post('/signup')
    .send({ username: 'newuser', password: 'newpass' });

  expect(response.statusCode).toBe(201);
  expect(response.body.message).toBe('User created successfully');
  expect(response.body.token).toBeDefined();
});

test('should fail signup with duplicate username', async () => {
  await request(app)
    .post('/signup')
    .send({ username: 'testuser', password: 'testpass' });

  const response = await request(app)
    .post('/signup')
    .send({ username: 'testuser', password: 'anotherpass' });

  expect(response.statusCode).toBe(400);
  expect(response.body.error).toBe('User already exists');
});

test('should login a user', async () => {
  await request(app)
    .post('/signup')
    .send({ username: 'testuser', password: 'testpass' });

  const response = await request(app)
    .post('/login')
    .send({ username: 'testuser', password: 'testpass' });

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe('Login successful');
  expect(response.body.token).toBeDefined();
});

test('should fail login with invalid credentials', async () => {
  await request(app)
    .post('/signup')
    .send({ username: 'testuser', password: 'testpass' });

  const response = await request(app)
    .post('/login')
    .send({ username: 'testuser', password: 'wrongpass' });

  expect(response.statusCode).toBe(401);
  expect(response.body.error).toBe('Invalid credentials');
});
