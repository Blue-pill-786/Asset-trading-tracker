const mongoose = require('mongoose');

module.exports = async () => {
  // Ensure that any open connections are closed
  await mongoose.connection.close();
};
