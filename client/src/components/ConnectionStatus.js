import React, { Component } from 'react';

export default class ConnectionStatus extends Component {
  render() {
    let status = this.props.connected ? 'Connected' : 'Disconnected';
    return (
      <div className="status-container">
        <strong>Status:</strong> {status}
      </div>
    );
  }
}