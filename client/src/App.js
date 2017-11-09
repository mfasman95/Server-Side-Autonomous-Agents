import React, { Component } from 'react';
import logo from './logo.svg';
import './css/App.css';
import Router from './components/generic/Router';
import { emit } from './scripts/socket';
import Pages, { NotFound } from './components/pages';

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
          <h1 className="App-title">Physics Simulation</h1>
        </header>
        <Router pages={Pages} notFound={NotFound}/>
      </div>
    );
  }
}

export default App;
