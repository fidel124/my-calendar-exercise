import React, { Component } from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import './App.css';

import Calendar from './Components/Calendar/';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
		  Developed by Fidelis.
          <Route path="/"  exact={true} strict component={Calendar} />
          <Route path="/:monthName"  exact={true} strict component={Calendar} />
        </div>
      </Router>
    );
  }
}

export default App;
