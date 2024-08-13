const mongoose = require('mongoose');
const app = require('./app'); // Adjust the path if needed

let server;

beforeAll(async () => {
  // Connect to the test database
  await mongoose.connect(process.env.TEST_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Start the server on a different port for testing
  server = app.listen(process.env.TEST_PORT || 4000);
});

afterAll(async () => {
  // Close the server
  await server.close();

  // Disconnect from the database
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear out the database collections
  await mongoose.connection.db.dropDatabase();
});
