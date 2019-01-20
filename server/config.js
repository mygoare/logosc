const path = require('path');

module.exports = {
  baseDir: path.resolve(__dirname),
  // app start port
  port: process.env.port || 5000,
  // app bind address
  address: process.env.NODE_ENV === 'production' ? '127.0.0.1' : '0.0.0.0',
};
