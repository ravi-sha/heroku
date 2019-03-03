import React, { Component } from 'react';
import TokBox from './components/Tokbox';
import { fetchSessionDetails } from './common/api';
import './App.css';
class App extends Component {

  state = {}

  async componentDidMount () {
    const response = await fetchSessionDetails();
    this.setState({ ...response });
  }

  render() {
    const { apiKey, sessionId, token } = this.state;
    if(!apiKey) {
      return <div className="loader">Loading...</div>
    }
    return (
      <TokBox 
        apiKey={apiKey}
        sessionId={sessionId}
        token={token}/>
    );
  }
}

export default App;
