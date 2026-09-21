'use strict';

process.env.LOOP_DISABLE_AUTO_LISTEN = 'true';
const { startServer } = require('./server');
const server = startServer();

module.exports = server;
