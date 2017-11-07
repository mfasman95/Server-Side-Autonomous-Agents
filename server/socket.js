const chalk = require('chalk');
const xxh = require('xxhashjs');

// Add custom classes
const { Room, User, Message } = require('./classes');

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
const emitToRoom = emitFunc => (room, message) => {
  for (let i = 0; i < room.currentOccupancy; i++) {
    const user = users[room.occupants[i]];
    emitFunc(user.socket, message);
  }
};
const genericEmitToRoom = emitToRoom(genericEmit);
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
        const updateMsg = new Message('UPDATE_ROOM', { room });
        reduxEmitToRoom(room, updateMsg);
        reduxEmitToRoom(startingRoom, updateMsg);
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
      rooms[room.id] = room;

      // Emit this room down to all clients
      reduxEmitToRoom(startingRoom, new Message('UPDATE_ROOM', { room }));
      break;
    }
    case 'joinRoom': {
      // Identify the room that the user is joining
      const room = rooms[data.room];
      if (room) {
        // Add the user to that room
        room.addUser(user);
        // Move this user to the simulation page
        reduxEmit(socket, new Message('CHANGE_PAGE', { page: 'Simulation' }));
        const updateMsg = new Message('UPDATE_ROOM', { room });
        // Update this client about the state of their room
        reduxEmit(socket, updateMsg);
        // Update every client still in the main room
        reduxEmitToRoom(startingRoom, updateMsg);
      }
      // TODO: Handle if the room doesn't exist
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
  // Send any necessary info for initiating the connection
  reduxEmit(socket, new Message('INIT', {
    rooms,
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
