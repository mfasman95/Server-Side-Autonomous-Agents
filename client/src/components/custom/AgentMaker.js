import React from 'react';
import { Panel, Button, Col, Row } from 'react-bootstrap';
import { emit } from './../../scripts/socket';
import Slider from './../generic/Slider';

class AgentMaker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      xPos: 225,
      yPos: 225,
      mass: 10,
      r: 128,
      g: 128,
      b: 128,
    }

    this.makeAgent = this.makeAgent.bind(this);
    this.handleXPos = this.handleXPos.bind(this);
    this.handleYPos = this.handleYPos.bind(this);
    this.handleMass = this.handleMass.bind(this);
    this.handleR = this.handleR.bind(this);
    this.handleG = this.handleG.bind(this);
    this.handleB = this.handleB.bind(this);
  }

  makeAgent() {
    emit('addAgent', {
      xPos: this.state.xPos,
      yPos: this.state.yPos,
      mass: this.state.mass,
      color: `rgb(${this.state.r},${this.state.g},${this.state.b})`,
    })
  }

  handleXPos(e) { this.setState({ xPos: e }) }
  handleYPos(e) { this.setState({ yPos: e }) }
  handleMass(e) { this.setState({ mass: e }) }
  handleR(e) { this.setState({ r: e }) }
  handleG(e) { this.setState({ g: e }) }
  handleB(e) { this.setState({ b: e }) }

  render() {
    return (
      <Panel>
        <h4>Create New Agents!</h4>
        <Row>
          <Col xs={4} xsOffset={1}>
            <Slider
              name='Red Value'
              step={1}
              min={0}
              max={255}
              value={this.state.r}
              onChange={this.handleR}
            />
            <Slider
              name='Green Value'
              step={1}
              min={0}
              max={255}
              value={this.state.g}
              onChange={this.handleG}
            />
            <Slider
              name='Blue Value'
              step={1}
              min={0}
              max={255}
              value={this.state.b}
              onChange={this.handleB}
            />
          </Col>
          <Col xs={4} xsOffset={2}>
            <Slider
              name='Starting X Value'
              step={1}
              min={0}
              max={550}
              value={this.state.xPos}
              onChange={this.handleXPos}
            />
            <Slider
              name='Starting Y Value'
              step={1}
              min={0}
              max={550}
              value={this.state.yPos}
              onChange={this.handleYPos}
            />
            <Slider
              name='Mass'
              step={1}
              min={1}
              max={20}
              value={this.state.mass}
              onChange={this.handleMass}
            />
          </Col>
        </Row>
        <Button bsStyle='success' onClick={this.makeAgent}>
          Add Agent
        </Button>
      </Panel>
    )
  }
}

export default AgentMaker;
