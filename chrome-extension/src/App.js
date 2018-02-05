import React, { Component } from 'react';
import 'tachyons';
import './App.css';
import Popup from './Popup';
class App extends Component {
  render() {
    return (
      <div className="App">
        <Popup />
      </div>
    );
  }
}

export default App;
