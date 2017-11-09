import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Well, Panel } from 'react-bootstrap';
import { Layer, Stage, Circle } from 'react-konva';
import { AgentMaker, ForceMaker, ForceList } from './../custom';
import { emit } from './../../scripts/socket';

class Simulation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: 'green',
      x: 10,
      y: 10,
    }

    this.handleAgentClick = this.handleAgentClick.bind(this);
  }

  handleAgentClick(id) { emit('destroyAgent', { id }); }

  render() {
    const { occupants } = this.props.room;
    const agentRenders = Object.keys(this.props.agents).map((agentId, i) => {
      // Identify this specific agent
      const agent = this.props.agents[agentId];

      // Function for handling a click of any agent
      const onClick = () => this.handleAgentClick(agentId);

      // Determine the specific type of Konva object being used to render this agent
      return (
        <Circle
          key={i}
          radius={agent.radius}
          x={agent.location.x || 0}
          y={agent.location.y || 0}
          fill={agent.color || 'white'}
          alpha={0.5}
          onClick={onClick}
        />
      );
    });
    return (
      <div>
        <Row>
            <Col xs={5} xsOffset={1}>
              <AgentMaker/>
            </Col>
            <Col xs={5}>
              <ForceMaker/>
            </Col>
        </Row>
        <Row>
          <Col xs={2} xsOffset={1}>
            <ForceList/>
          </Col>
          <Col xs={6}>
            <Stage width={550} height={550}>
              <Layer>
                { agentRenders }
              </Layer>
            </Stage>
          </Col>
          <Col xs={2}>
            <Well className='user-panel-well'>
              <h3>Users</h3>
              {
                occupants.map((occupant, i) => 
                  <Panel
                    key={i}
                    className={
                      (occupant.id === this.props.myId) ? 
                        'user-panel-self' :
                        'user-panel'
                    }
                  >
                    { occupant.name }
                  </Panel>
                )
              }
            </Well>
          </Col>
        </Row>
      </div>
    );
  }
}

//Function to map the redux state to object properties
const mapStateToProps = (state, ownProps) => {
  return {
    room: state.main.rooms[state.main.inRoom],
    myId: state.main.id,
    agents: state.main.agents,
  }
};

export default connect(mapStateToProps)(Simulation);
