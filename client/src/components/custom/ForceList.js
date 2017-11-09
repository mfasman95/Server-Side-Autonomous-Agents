import React from 'react';
import { connect } from 'react-redux';
import { Well, Panel, Button, Col } from 'react-bootstrap';
import { emit } from './../../scripts/socket';

class ToDo extends React.Component {
  render() {
    return (
      <Col xs={10} xsOffset={1}>
        <Well className='forces-well'>
          {
            Object.keys(this.props.forces).length <= 0 ?
              // If there are no forces
              <h4>There Are No Forces To Display</h4> :
              Object.keys(this.props.forces).map((forceKey, i) => {
                const { xDir, yDir, magnitude, id } = this.props.forces[forceKey];
                return (
                  <Panel key={i}>
                    <h6>X Direction: {xDir}</h6>
                    <h6>Y Direction: {yDir}</h6>
                    <h6>Magnitude: {magnitude}</h6>
                    <Button
                      bsSize='small'
                      bsStyle='danger'
                      onClick={()=>{ emit('destroyForce', { id }); }}
                    >
                      Delete
                    </Button>
                  </Panel>
                );
              })
          }
        </Well>
      </Col>
    )
  }
}

const mapStateToProps = (state, ownprops) => {
  return {
    forces: state.main.forces,
  }
}

export default connect(mapStateToProps)(ToDo);
