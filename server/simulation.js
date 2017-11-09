const chalk = require('chalk');
const extend = require('extend');
const { Message, Agent, Force } = require('./classes');

const { log } = console;

const exampleAgent = new Agent({
  xPos: 50,
  yPos: 50,
  mass: 10,
});
const agents = { [exampleAgent.id]: exampleAgent };
const exampleForce = new Force(1, 0, 5);
const forces = { [exampleForce.id]: exampleForce };

const applyForces = () => {
  // Copy agents and forces to use for the duration of this function
  const tempAgents = extend(true, {}, agents);
  const tempForces = extend(true, {}, forces);

  const agentKeys = Object.keys(tempAgents);
  for (let i = 0; i < agentKeys.length; i++) {
    // Identify the agent
    const agent = tempAgents[agentKeys[i]];
    // Apply all the forces to the agent
    const forceKeys = Object.keys(tempForces);
    for (let j = 0; j < forceKeys.length; j++) {
      const force = tempForces[forceKeys[j]];
      agent.applyForce(force.forceVec);
    }
    // Update the agent position after all forces have been applied
    agent.update();
    agents[agent.id] = agent;
  }
};

const runSimulation = () => {
  applyForces();
  process.send(new Message('simulationUpdate', { agents, forces }));
};

process.on('message', (messageObj) => {
  const { event, data } = messageObj;

  switch (event) {
    case 'updateAgent': {
      const agent = new Agent({
        xPos: data.agent.xPos,
        yPos: data.agent.yPos,
        mass: data.agent.mass,
        color: data.agent.color,
      });
      agents[agent.id] = agent;
      break;
    }
    case 'removeAgent': {
      delete agents[data.id];
      break;
    }
    case 'updateForce': {
      const force = new Force(data.force.xDir, data.force.yDir, data.force.magnitude);
      forces[force.id] = force;
      break;
    }
    case 'deleteForce': {
      delete forces[data.id];
      break;
    }
    default: { log(chalk.red(`Unrecognized simulation event ${event} received on child process...`)); break; }
  }
});

setInterval(runSimulation, 1000 / 60);
