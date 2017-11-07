import React, { Component } from 'react';
import logo from './logo.svg';
import './css/App.css';
import Router from './components/generic/Router';
import { emit } from './scripts/socket';

// Import 404 page
import NotFound from './components/pages/NotFound';
// Import the pages
import Home from './components/pages/Home';
import RoomSelect from './components/pages/RoomSelect';

// Store the imported pages in a single object to pass to the router
const pages = {
  Home,
  RoomSelect,
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img
            src={logo}
            className="App-logo"
            alt="logo"
            onClick={ () => emit('goHome', {}) }
          />
          <h1 className="App-title">Autonomous Agent Demos</h1>
        </header>
        <Router pages={pages} notFound={NotFound}/>
      </div>
    );
  }
}

export default App;
