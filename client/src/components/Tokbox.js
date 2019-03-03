import React from 'react';
import { OTSession, OTStreams } from 'opentok-react';

import ConnectionStatus from './ConnectionStatus';
import Publisher from './Publisher';
import Subscriber from './Subscriber';

class TokBox extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            connected: false
        };
        this.sessionEvents = {
            sessionConnected: () => {
                this.setState({ connected: true });
            },
            sessionDisconnected: () => {
                this.setState({ connected: false });
            }
        };
    }

    onError = (err) => {
        this.setState({ error: `Failed to connect: ${err.message}` });
    }

    render () {
        const { apiKey, sessionId, token } = this.props;
        const { connected, error } = this.state;
        return (
            <OTSession 
                apiKey={apiKey} 
                sessionId={sessionId} 
                token={token}
                eventHandlers={this.sessionEvents}
                onError={this.onError}>
                 {error ? <div>{error}</div> : null}
                <ConnectionStatus connected={connected} />
                <div className={`connecting ${connected ? 'hide' : 'show'}`}>Connecting...</div>
                <Publisher />
                <OTStreams>
                    <Subscriber />
                </OTStreams>
            </OTSession>
        )
    }

}


export default TokBox;