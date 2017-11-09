class User {
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
}

module.exports = Object.freeze({ User });
