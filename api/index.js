'use strict';

const { createServer } = require('../server');

// Vercel fornece IncomingMessage/ServerResponse compatíveis com o listener HTTP.
const server = createServer();

module.exports = (request, response) => server.emit('request', request, response);
