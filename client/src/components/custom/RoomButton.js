import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { emit } from './../../scripts/socket';

class ToDo extends React.Component {
  constructor(props) {
    super(props);

    this.joinRoom = this.joinRoom.bind(this);
  }

  joinRoom() {
    emit('joinRoom', { room: this.props.room.id });
  }

  render() {
    const { name, currentOccupancy } = this.props.room;
    return (
      <Button
        className='room-button'
        bsSize='large'
        bsStyle='primary'
        onClick={this.joinRoom}
      >
        <h4>{name}</h4>
        <h6>Occupancy: {currentOccupancy}</h6>
      </Button>
    )
  }
}

const mapStateToProps = (state, ownprops) => {
  return {
    room: state.main.rooms[ownprops.id],
  }
}

export default connect(mapStateToProps)(ToDo);
