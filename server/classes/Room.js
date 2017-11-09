const childProcess = require('child_process');
const path = require('path');

const xxh = require('xxhashjs');
const chalk = require('chalk');

const { Message } = require('./Message');

const { log } = console;

class Room {
  constructor(name) {
    // A name for this room
    this.name = name;
    // A unique ID for this room
    this.id = xxh.h32(`${name}${new Date().getTime()}`, 0xCAFEBABE).toString(16);
    // Container for room occupant lookup
    this.occupants = [];

    // Store the current occupancy of the room
    this.currentOccupancy = this.occupants.length;

    // The set of keys to pick off this object when sending it over socket io
    this.keysToPick = ['name', 'id', 'occupants', 'currentOccupancy'];

    if (this.name !== '**INIT_ROOM**') {
      // Store a reference to the child process this room spawns for physics simulations
      this.simulation = childProcess.fork(path.resolve(`${__dirname}./../simulation`));

      // Handle events from this process
      this.simulation.on('message', (message) => {
        const { event, data } = message;

        switch (event) {
          case 'simulationUpdate': {
            if (this.reduxEmitAll) {
              this.reduxEmitAll(new Message('SIMULATION_UPDATE', data));
            }
            break;
          }
          default: { log(chalk.yellow(`Unrecognized simulation event ${event} received from child process...`)); break; }
        }
      });
      this.simulation.on('error', error => log(chalk.red(error)));
      this.simulation.on('close', (code, signal) => log(chalk.green(`Child closed with ${code} ${signal}`)));
      this.simulation.on('exit', (code, signal) => log(chalk.green(`Child exited with ${code} ${signal}`)));
    }
  }

  addUser(user) {
    // Tell that user that they joined a room
    user.joinRoom(this.id);
    // Add that user to the object containing occupants of the room
    this.occupants.push({
      id: user.id,
      name: user.name,
    });
    // Update the occupancy count of this room
    this.currentOccupancy = this.occupants.length;
  }

  removeUser(user) {
    // Tell the user that they left the room
    user.leaveRoom();
    // Delete the user from the occupants object on this room
    for (let i = 0; i < this.occupants; i++) {
      if (this.occupants[i].id === user.id) {
        this.occupants.splice(i, 1);
      }
    }
    // Update the occupancy count of this room
    this.currentOccupancy = this.occupants.length;
  }
}

module.exports = Object.freeze({ Room });
