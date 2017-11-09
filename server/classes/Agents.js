const Vec2 = require('victor');
const xxh = require('xxhashjs');

// Function for generating a random 0 to 255 value
const random0to255 = () => Math.floor(Math.random() * 255);
// Build a color from three random values
const randomColor = () => `rgb(${random0to255()},${random0to255()},${random0to255()})`;

const simWindow = Object.freeze({
  width: 550,
  height: 550,
});

// Base class that all agents inherit from
/**
 * @class Agent - A class for a generic physics agent
 * @param xPos - The starting x position of the agent
 * @param yPos - The starting y position of the agent
 * @param mass - The mass of the agent (affects radius)
 * @param color - The color of the agent - default to random
*/
class Agent {
  constructor(params) {
    this.xPosInit = params.xPos || (550 / 2); // Default to center
    this.yPosInit = params.yPos || (550 / 2); // Default to center

    // A mass for use in force calculations
    this.mass = params.mass || 10;

    // Constrain mass (and by extension, radius)
    const radScale = 5;
    const maxRadius = 200;
    if (this.mass * radScale > maxRadius) this.mass = maxRadius / radScale;

    // Give this agent a radius based on its mass
    this.radius = this.mass * 5;

    // Calculate the bounds of this object in the simulation space
    this.maxX = simWindow.width - this.radius;
    this.minX = 0 + this.radius;
    this.maxY = simWindow.height - this.radius;
    this.minY = 0 + this.radius;

    // Make sure the starting position is inbounds of the parent window
    if (this.xPosInit > this.maxX) this.xPosInit = this.maxX;
    if (this.xPosInit < this.minX) this.xPosInit = this.minX;
    if (this.yPosInit > this.maxY) this.yPosInit = this.maxY;
    if (this.yPosInit < this.minY) this.yPosInit = this.minY;

    // Store position in a Vec2 for calculation purposes
    this.location = new Vec2(this.xPosInit, this.yPosInit);

    // An agent has no default starting velocity
    this.velocity = new Vec2(0, 0);
    // An agent has no default starting acceleration
    this.acceleration = new Vec2(0, 0);
    // A maxspeed consistent across all agents
    this.maxSpeed = 20;
    // Randomly assign a color for a given agent
    this.color = params.color || randomColor();
    // A unique ID for this agent
    this.id = xxh.h32(`${JSON.stringify(params)}${new Date().getTime()}`, 0xCAFEBABE).toString(16);
  }

  // Function for applying forces to this object
  applyForce(f) {
    // Copy the force param to avoid mutation
    const force = Vec2.fromObject(f);
    // Apply Newton's Second Law
    force.divideScalar(this.mass * 100);
    // Add adjusted force to acceleration
    this.acceleration.add(force);
  }

  // Update loop for this object
  update() {
    const { location, velocity, acceleration } = this;
    // Apply acceleration
    velocity.add(acceleration);
    // Make sure velocity has not exceeded maximum speed
    // Use length squared for faster calculation time
    if (velocity.lengthSq() > (this.maxSpeed * this.maxSpeed)) {
      // Set the velocity to a magnitude of maxSpeed if it has exceeded max speed
      velocity.normalize().multiplyScalar(this.maxSpeed);
    }
    // Apply velocity
    location.add(velocity);
    // Reset acceleration
    acceleration.multiplyScalar(0);
    // Make sure the agent has not left the simulation space
    this.checkEdges();
  }

  // Simple edge detection which flips the agent's velocity when it hits a wall
  checkEdges() {
    if (this.location.x > this.maxX) {
      this.location.x = this.maxX;
      this.velocity.invertX();
    }
    if (this.location.x < this.minX) {
      this.location.x = this.minX;
      this.velocity.invertX();
    }
    if (this.location.y > this.maxY) {
      this.location.y = this.maxY;
      this.velocity.invertY();
    }
    if (this.location.y < this.minY) {
      this.location.y = this.minY;
      this.velocity.invertY();
    }
  }
}

module.exports = Object.freeze({ Agent });
