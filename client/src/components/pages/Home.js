import React from 'react';
import { Col } from 'react-bootstrap';
import TextInput from './../generic/TextInput';
import { emit } from './../../scripts/socket';

class Home extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      username: 'a',
    }

    this.usernameInput = this.usernameInput.bind(this);
    this.usernameSubmit = this.usernameSubmit.bind(this);
  }

  usernameInput(e){ this.setState({ username: e.target.value }); }
  usernameSubmit(){
    if (this.state.username !== '') {
      // Send the username data to the server
      emit('setUsername', { username: this.state.username });
      // Clear the username input field
      this.setState({ username: '' });
    }
  }

  render() {
    return (
      <div>
        <h3>Enter Your Username</h3>
        <Col xs={8} xsOffset={2}>
          <TextInput
            title='Username'
            placeholder='Enter your username here...'
            value={this.state.username}
            updateValue={this.usernameInput}
            submit={this.usernameSubmit}
          />
        </Col>
      </div>
    );
  }
}

export default (Home);