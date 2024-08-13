const request = require('supertest');
const app = require('../app'); // Adjust the path to your app file

describe('Asset Management', () => {
  let token;
  let assetId;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'password123' });
    token = loginResponse.body.token;
  });

  test('should create an asset as a draft', async () => {
    const response = await request(app)
      .post('/assets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Asset', status: 'draft' });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('status', 'draft');
  });

  test('should create an asset as published', async () => {
    const response = await request(app)
      .post('/assets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Asset Published', status: 'published' });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('status', 'published');
  });

  test('should retrieve asset details', async () => {
    const assetResponse = await request(app)
      .post('/assets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Asset Details', status: 'published' });
    assetId = assetResponse.body._id;

    const response = await request(app)
      .get(`/assets/${assetId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name', 'Test Asset Details');
  });

  test('should retrieve user\'s assets', async () => {
    const response = await request(app)
      .get('/assets/user')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
