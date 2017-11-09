import io from 'socket.io-client';
import store from './../redux/store';

const { warn, log } = console;

let sock;
export const connect = () => {
  sock = (
    // Socket connection location depends on NODE_ENV
    (process.env.NODE_ENV === 'development') ?
      sock = io.connect('http://localhost:3001') :
      sock = io.connect('HEROKU_SERVER_LOCATION')
  );
};
connect();

const socket = sock;
export default socket;

export const emit = (event, data) => socket.emit('clientEmit', { event, data });

const genericEmitHandler = (emitData) => {
  switch (emitData.event) {
    case 'joined': {
      return log('User Joined Socket Io!');
    }
    default: {
      return warn(`Received a generic emit with an unknown event name: ${emitData.event}`);
    }
  }
};

// Convery emits from the server directly into actions for the store
socket.on('serverEmit', (emitData) => {
  switch (emitData.type) {
    case 'redux': {
      const action = { type: emitData.event };
      // Merges the action type and emit data into a single object
      Object.assign(action, emitData.data);
      return store.dispatch(action);
    }
    case 'generic': {
      return genericEmitHandler(emitData);
    }
    default: {
      return warn(`Received an event from the server with an unknown type ${emitData.type}`, emitData);
    }
  }
});
