'use strict';

const { createServer, runAutomaticPostpone } = require('./server');

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';
const server = createServer();

server.listen(port, host, () => {
  console.log(`Loop Leiloes: http://${host}:${port}`);
});

const automaticPostponeTimer = setInterval(runAutomaticPostpone, 60_000);
automaticPostponeTimer.unref();

module.exports = server;
