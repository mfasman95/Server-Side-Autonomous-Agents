import extend from 'extend';

// Set initial application state
const initialState = {
  rooms: {},
  agents: {},
  forces: {},
};

// Handle actions dispatched to the reducer
const actionHandlers = {
  INIT: (returnState, action) => {
    const rs = returnState;

    // Set the initial rooms
    rs.rooms = action.rooms;
    rs.id = action.id;
    return rs;
  },
  UPDATE_ROOM: (returnState, action) => {
    const rs = returnState;

    // Set the new room state for the specified room
    rs.rooms[action.room.id] = action.room;
    return rs;
  },
  REMOVE_ROOM: (returnState, action) => {
    const rs = returnState;

    // Remove the given room from the state
    delete rs.rooms[action.room.id];
    return rs;
  },
  SELECT_ROOM: (returnState, action) => {
    const rs = returnState;

    // Store the room this user has selected
    rs.inRoom = action.id;
    return rs;
  },
  LEAVE_ROOM: (returnState) => {
    const rs = returnState;

    // Delete the memory of the room this user selected
    delete rs.inRoom;
    return rs;
  },
  SIMULATION_UPDATE: (returnState, action) => {
    const rs = returnState;

    // Get updated info on the agents and forces in the simulation
    rs.agents = action.agents;
    rs.forces = action.forces;
    return rs;
  },
};

// Export the reducer
export default (state = initialState, action) => {
  // Make an object for the return state
  const rs = extend(true, {}, state);

  // Handle unknown action types
  if (!actionHandlers[action.type]) return rs;

  // Handle the action dispatched to the reducer, return the updated state
  return actionHandlers[action.type](rs, action, state);
};
