const xxh = require('xxhashjs');

// A class for managing rooms
module.exports.Room = class Room {
  constructor(name) {
    // A name for this room
    this.name = name;
    // A unique ID for this room
    this.id = xxh.h32(`${name}${new Date().getTime()}`, 0xCAFEBABE).toString(16);
    // Container for room occupants
    this.occupants = [];
    // Store the current occupancy of the room
    this.currentOccupancy = this.occupants.length;
  }

  addUser(user) {
    // Tell that user that they joined a room
    user.joinRoom(this.id);
    // Add that user to the object containing occupants of the room
    this.occupants.push(user.id);
    // Update the occupancy count of this room
    this.currentOccupancy = this.occupants.length;
  }

  removeUser(user) {
    // Tell the user that they left the room
    user.leaveRoom();
    // Delete the user from the occupants object on this room
    this.occupants.splice(this.occupants.indexOf(user.id), 1);
    // Update the occupancy count of this room
    this.currentOccupancy = this.occupants.length;
  }
};

// A class for managing users
module.exports.User = class User {
  constructor(socket) {
    // Store the user socket
    this.socket = socket;
    // Unique id for this user
    this.id = socket.hash;
    // Variable to store the room this user is in
    this.inRoom = undefined;
    // Variable to store this user's name
    this.name = undefined;
  }

  // Store the id for the room the user is in
  joinRoom(roomId) { this.inRoom = roomId; }
  // Clear the id for the room the user is in
  leaveRoom() { this.inRoom = undefined; }

  // Update this user's name
  setName(name) { this.name = name; }
};

// A class for managing generic message objects
module.exports.Message = class Message {
  constructor(eventName, data) {
    this.event = eventName;
    this.data = data;
    this.timestamp = new Date().getTime();
  }
};
