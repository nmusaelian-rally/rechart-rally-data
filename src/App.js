import React, { Component } from 'react';
import IterationDropdown from './components/IterationDropdown';
import BarRechart from './components/BarRechart';

class App extends Component {
  state = {
    iteration: null
  } 

  selectIteration = (value) => {
    console.log(`calling getIteration of App component with value: ${value}`);
    this.setState({
        iteration: value
    })
  }
  render(){
      return (
        <div className="App">
            <h3 id="top">Count of stories moved to InProgress and Released during iteration</h3>
            <div id="left">
              <IterationDropdown selectIteration={this.selectIteration} />
            </div>
            <div id="right">
              {this.state.iteration  && <BarRechart iteration={this.state.iteration} />}
            </div>
        </div>
      );
  }  
}

export default App;
