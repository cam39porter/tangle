import React, { Component } from "react";
import "./app.css";

class App extends Component {
  render() {
    return (
      <div className={`fixed top-1 right-1 z-max pa3 bg-white shadow-1 br2`}>
        Page shared to <span className={`bb b--accent`}>Tangle!</span>
      </div>
    );
  }
}

export default App;
