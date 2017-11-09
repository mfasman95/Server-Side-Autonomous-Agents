import React from 'react';
import { Panel, Button, Col } from 'react-bootstrap';
import { emit } from './../../scripts/socket';
import Slider from './../generic/Slider';

class ForceMaker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      xDir: 0,
      yDir: 0,
      magnitude: 10,
    }

    this.makeForce = this.makeForce.bind(this);
    this.handleXDir = this.handleXDir.bind(this);
    this.handleYDir = this.handleYDir.bind(this);
    this.handleMagnitude = this.handleMagnitude.bind(this);
  }

  makeForce() {
    emit('addForce', {
      xDir: this.state.xDir,
      yDir: this.state.yDir,
      magnitude: this.state.magnitude,
    })
  }

  handleXDir(val) { this.setState({ xDir: val }); }
  handleYDir(val) { this.setState({ yDir: val }); }
  handleMagnitude(val) { this.setState({ magnitude: val }); }

  render() {
    return (
      <Panel>
        <h4>Create New Forces!</h4>
        <Col xs={4} xsOffset={1}>
          <Slider
            name={'X Direction'}
            step={0.05}
            min={-1}
            max={1}
            value={this.state.xDir}
            onChange={this.handleXDir}
          />
        </Col>
        <Col xs={4} xsOffset={2}>
          <Slider
            name={'Y Direction'}
            step={0.05}
            min={-1}
            max={1}
            value={this.state.yDir}
            onChange={this.handleYDir}
          />
        </Col>
        <Slider
          name={'Magnitude'}
          step={1}
          min={0}
          max={20}
          value={this.state.magnitude}
          onChange={this.handleMagnitude}
        />
        <Button bsStyle='success' onClick={this.makeForce}>
          Add Force
        </Button>
      </Panel>
    )
  }
}

export default ForceMaker;
