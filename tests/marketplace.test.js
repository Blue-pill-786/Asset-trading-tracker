const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Asset = require('../models/Asset');
const Request = require('../models/Request');
const mongoose = require('mongoose');

let token;
let userId;
let assetId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
  await User.deleteMany({});
  await Asset.deleteMany({});
  await Request.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  const userResponse = await request(app)
    .post('/auth/signup')
    .send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
  token = userResponse.body.token;
  userId = (await User.findOne({ username: 'testuser' }))._id;

  const assetResponse = await request(app)
    .post('/assets')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Test Asset',
      description: 'Description of test asset',
      image: 'http://example.com/image.png',
      status: 'draft'
    });
  assetId = assetResponse.body.assetId;
});

describe('Marketplace and Trading API', () => {
  test('should create a purchase request', async () => {
    const response = await request(app)
      .post(`/requests/${assetId}/request`)
      .set('Authorization', `Bearer ${token}`)
      .send({ proposedPrice: 100 });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Purchase request sent');
  });

  test('should negotiate a purchase request', async () => {
    const requestResponse = await request(app)
      .post(`/requests/${assetId}/request`)
      .set('Authorization', `Bearer ${token}`)
      .send({ proposedPrice: 100 });

    const requestId = (await Request.findOne({ asset: assetId }))._id;

    const response = await request(app)
      .put(`/requests/${requestId}/negotiate`)
      .set('Authorization', `Bearer ${token}`)
      .send({ newProposedPrice: 150 });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Negotiation updated');
  });

  test('should accept a purchase request', async () => {
    const requestResponse = await request(app)
      .post(`/requests/${assetId}/request`)
      .set('Authorization', `Bearer ${token}`)
      .send({ proposedPrice: 100 });

    const requestId = (await Request.findOne({ asset: assetId }))._id;

    const response = await request(app)
      .put(`/requests/${requestId}/accept`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Request accepted, holder updated');
  });

  test('should deny a purchase request', async () => {
    const requestResponse = await request(app)
      .post(`/requests/${assetId}/request`)
      .set('Authorization', `Bearer ${token}`)
      .send({ proposedPrice: 100 });

    const requestId = (await Request.findOne({ asset: assetId }))._id;

    const response = await request(app)
      .put(`/requests/${requestId}/deny`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Request denied');
  });

  test('should retrieve user\'s purchase requests', async () => {
    await request(app)
      .post(`/requests/${assetId}/request`)
      .set('Authorization', `Bearer ${token}`)
      .send({ proposedPrice: 100 });

    const response = await request(app)
      .get(`/requests/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
