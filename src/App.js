import React,{Component} from 'react';
import Webcam from 'react-webcam';


class App extends Component {
  render() {
    return (
      <div class="camera">
        <Webcam />
      </div>
      
    );
  }
  
}

export default App;
