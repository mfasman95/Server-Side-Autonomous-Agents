const childProcess = require('child_process');
const path = require('path');

const chalk = require('chalk');
const xxh = require('xxhashjs');
const _ = require('lodash');

// Add custom classes
const {
  Room,
  User,
  Message,
} = require('./classes');

const { log } = console;

// Create a reference to io, to be assigned when initSockets is called
let io;

// Initialize object for storing rooms
const startingRoom = new Room('**INIT_ROOM**');
const rooms = {};

// Initialize object for storing users
const users = {};

// Build functions to emit to a single client
const emit = type => (socket, message) => {
  const { event, data, timestamp } = message;

  socket.emit('serverEmit', {
    type,
    event,
    data,
    timestamp,
  });
};
const genericEmit = emit('generic');
const reduxEmit = emit('redux');

// Build functions to emit to a full room
const emitToRoom = emitFunc => room => (message) => {
  for (let i = 0; i < room.currentOccupancy; i++) {
    const user = users[room.occupants[i].id];
    if (user) emitFunc(user.socket, message);
  }
};
// const genericEmitToRoom = emitToRoom(genericEmit);
const reduxEmitToRoom = emitToRoom(reduxEmit);

const clientEmitHandler = (sock, eventData) => {
  const socket = sock;
  const { event, data } = eventData;
  const user = users[socket.hash];

  switch (event) {
    case 'goHome': {
      // Handle if the user is in a room other than the starting room
      if (user.inRoom !== startingRoom.id) {
        const room = rooms[user.inRoom];

        // Remove the user from their old room
        room.removeUser(user);
        // Move the user back to the starting room
        startingRoom.addUser(user);

        // Send the updated room info to the users in the specified room
        // and to the users in the starting room
        const roomData = _.pick(room, room.keysToPick);
        const updateMsg = new Message('UPDATE_ROOM', { room: roomData });
        reduxEmitToRoom(room)(updateMsg);
        reduxEmitToRoom(startingRoom)(updateMsg);
      }

      // Clear the user's name
      user.setName(undefined);

      reduxEmit(socket, new Message('CHANGE_PAGE', { page: 'Home' }));
      break;
    }
    case 'setUsername': {
      user.setName(data.username);
      reduxEmit(socket, new Message('CHANGE_PAGE', { page: 'RoomSelect' }));
      break;
    }
    case 'makeRoom': {
      const room = new Room(data.roomName);
      // Give this room a reference to the function that can emit to everyone inside of it
      room.reduxEmitAll = reduxEmitToRoom(room);

      // Store this room in the rooms object
      rooms[room.id] = room;

      // Emit this room down to all clients
      const roomData = _.pick(room, room.keysToPick);
      reduxEmitToRoom(startingRoom)(new Message('UPDATE_ROOM', { room: roomData }));
      break;
    }
    case 'joinRoom': {
      // Identify the room that the user is joining
      const room = rooms[data.room];
      if (room) {
        // Add the user to that room
        room.addUser(user);
        // Move this user to the simulation page
        reduxEmit(socket, new Message('SELECT_ROOM', { id: room.id }));
        reduxEmit(socket, new Message('CHANGE_PAGE', { page: 'Simulation' }));
        const roomData = _.pick(room, room.keysToPick);
        const updateMsg = new Message('UPDATE_ROOM', { room: roomData });
        // Update this client about the state of their room
        reduxEmit(socket, updateMsg);
        // Update every client still in the main room
        reduxEmitToRoom(startingRoom)(updateMsg);
      }
      // TODO: Handle if the room doesn't exist
      break;
    }
    case 'destroyForce': {
      const room = rooms[user.inRoom];
      room.simulation.send(new Message('deleteForce', { id: data.id }));
      break;
    }
    case 'destroyAgent': {
      const room = rooms[user.inRoom];
      room.simulation.send(new Message('removeAgent', { id: data.id }));
      break;
    }
    case 'addForce': {
      const room = rooms[user.inRoom];
      room.simulation.send(new Message('updateForce', { force: data }));
      break;
    }
    case 'addAgent': {
      const room = rooms[user.inRoom];
      room.simulation.send(new Message('updateAgent', { agent: data }));
      break;
    }
    default: { log(chalk.red(`Emit ${event} received from ${socket.hash} without a handler`)); }
  }
};

const handleConnect = (sock) => {
  const socket = sock;

  // Create a unique ID to reference this socket by
  const hash = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);
  socket.hash = hash;

  // Store the user in the collection of all users
  users[hash] = new User(socket);

  // Add this user to the default room
  startingRoom.addUser(users[hash]);

  // Emit that the user joined to the client
  genericEmit(socket, new Message('joined', {}));

  // Make sure the initial room data being sent is valid for going over socket.io
  const roomsData = {};
  const roomKeys = Object.keys(rooms);
  for (let i = 0; i < roomKeys.length; i++) {
    const room = rooms[roomKeys[i]];
    roomsData[room.id] = _.pick(room, room.keysToPick);
  }

  // Send any necessary info for initiating the connection
  reduxEmit(socket, new Message('INIT', {
    rooms: roomsData,
    id: hash,
  }));
};

const handleDisconnect = (sock) => {
  const socket = sock;

  // Get the relevant user and room using information on the socket
  const user = users[socket.hash];
  const room = rooms[user.inRoom] || startingRoom;

  // Remove the user from the room they were in
  room.removeUser(user);

  // Delete this user from the collection of users
  delete users[socket.hash];
};

module.exports = Object.freeze({
  initSockets: (ioServer) => {
    // Store an instance of our websocket server
    io = ioServer;

    io.on('connection', (sock) => {
      const socket = sock;

      handleConnect(socket);
      socket.on('clientEmit', data => clientEmitHandler(socket, data));
      socket.on('disconnect', () => handleDisconnect(socket));
    });
  },
});
