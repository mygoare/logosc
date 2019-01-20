const path = require('path');
const express = require('express');
const pino = require('pino')({
  prettyPrint: {
    colorize: true,
    translateTime: true,
  },
});

const routes = require('./routes/');
const config = require('./config');

const { port, address } = config;

// create express app
const app = express();


// set static
app.use('/', express.static(path.resolve(config.baseDir, 'public')));

// routes
app.use('/', routes);

// error handling
app.use((err, req, res, next) => {
  pino.error(err.stack);
});


if (!module.parent) {
  // app start
  app.listen(port, address, () => console.log(`app listen on address ${address} port ${port}...`));
}

module.exports = app;
