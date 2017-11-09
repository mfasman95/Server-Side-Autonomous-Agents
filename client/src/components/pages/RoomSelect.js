import React from 'react';
import { connect } from 'react-redux';
import { Col, Well } from 'react-bootstrap';
import TextInput from './../generic/TextInput';
import RoomButton from './../custom/RoomButton';
import { emit } from './../../scripts/socket';

class RoomSelect extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      roomName: '',
    }

    this.roomInput = this.roomInput.bind(this);
    this.roomSubmit = this.roomSubmit.bind(this);
  }

  roomInput(e){ this.setState({ roomName: e.target.value }); }
  roomSubmit(){
    if (this.state.username !== '') {
      // Send the username data to the server
      emit('makeRoom', { roomName: this.state.roomName });
      // Clear the username input field
      this.setState({ roomName: '' });
    }
  }

  render() {
    const roomKeys = Object.keys(this.props.rooms);
    const hasRooms = roomKeys.length > 0;

    return (
      <Col xs={10} xsOffset={1}>
        <h3>Select a Room, or Make a New One!</h3>
        <TextInput
          title='Make Room'
          placeholder='Enter a unique room name here...'
          value={this.state.roomName}
          updateValue={this.roomInput}
          submit={this.roomSubmit}
        />
        {
          hasRooms ?
            // If there are rooms, map them to buttons for those rooms
            <Well className='room-well'>
             { roomKeys.map((key, i) => <RoomButton key={i} id={key}/>) }
            </Well> :
            // If there are not rooms, display a message
            <h4>There Are No Rooms To Select</h4>
        }
      </Col>
    );
  }
}

//Function to map the redux state to object properties
const mapStateToProps = (state, ownProps) => {
  return {
    rooms: state.main.rooms,
  }
};

export default connect(mapStateToProps)(RoomSelect);