const http = require('http');
const path = require('path');

const express = require('express');
const socketio = require('socket.io');
const chalk = require('chalk');

const sockets = require('./socket.js');

const { log } = console;
const PORT = process.env.PORT || process.env.NODE_PORT || 3001;

const app = express();

app.use('/', express.static(path.resolve(`${__dirname}./../client/build/`)));

const server = http.createServer(app);

const io = socketio(server);

sockets.initSockets(io);

server.listen(PORT, (err) => {
  if (err) throw err;

  log(chalk.blue(`Listening on port ${PORT}`));
});
