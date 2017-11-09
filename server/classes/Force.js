const Vec2 = require('victor');
const xxh = require('xxhashjs');

// Base class that all agents inherit from
class Force {
  constructor(xDir, yDir, magnitude) {
    this.xDir = xDir;
    this.yDir = yDir;
    this.magnitude = magnitude;
    // Determine the direction of the force
    this.dirVec = new Vec2(xDir, yDir).normalize();
    // Determine the force vector based on inputs
    this.forceVec = this.dirVec.clone().multiplyScalar(magnitude);
    // A unique id for this force
    this.id = xxh.h32(`${JSON.stringify(this.forceVec)}${new Date().getTime()}`, 0xCAFEBABE).toString(16);
  }
}

module.exports = Object.freeze({ Force });
