const request = require('supertest');
const app = require('../app'); // Adjust the path to your app file

describe('Marketplace and Trading', () => {
  let token;
  let assetId;
  let requestId;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'password123' });
    token = loginResponse.body.token;

    const assetResponse = await request(app)
      .post('/assets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Purchase Asset', status: 'published' });
    assetId = assetResponse.body._id;
  });

  test('should retrieve assets on the marketplace', async () => {
    const response = await request(app)
      .get('/marketplace/assets');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should create a purchase request', async () => {
    const response = await request(app)
      .post('/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ asset: assetId, amount: 10 });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('asset', assetId);
    expect(response.body).toHaveProperty('amount', 10);
    requestId = response.body._id;
  });

  test('should negotiate a purchase request', async () => {
    const response = await request(app)
      .put(`/requests/${requestId}/negotiate`)
      .set('Authorization', `Bearer ${token}`)
      .send({ newAmount: 15 });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('amount', 15);
  });

  test('should accept a purchase request', async () => {
    const response = await request(app)
      .post(`/requests/${requestId}/accept`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'accepted');
  });

  test('should deny a purchase request', async () => {
    const response = await request(app)
      .post(`/requests/${requestId}/deny`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'denied');
  });

  test('should retrieve user\'s purchase requests', async () => {
    const response = await request(app)
      .get('/requests/user')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
