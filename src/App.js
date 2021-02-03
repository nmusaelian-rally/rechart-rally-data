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
            <IterationDropdown selectIteration={this.selectIteration} />
            {this.state.iteration  && <BarRechart iteration={this.state.iteration} />}
        </div>
      );
  }  
}

export default App;
