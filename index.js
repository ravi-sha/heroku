const express = require('express');
const path = require('path');
const app = express();
const _ = require('lodash');

process.env.TOKBOX_API_KEY = '46273502';
process.env.TOKBOX_SECRET = 'aaea88180dd5328cb543f243dd75a98e8c53f871';

const apiKey = process.env.TOKBOX_API_KEY;
const secret = process.env.TOKBOX_SECRET;
const roomToSessionIdDictionary = {};
var OpenTok;
var opentok;

if (!apiKey || !secret) {
  console.error('=========================================================================================================');
  console.error('');
  console.error('Missing TOKBOX_API_KEY or TOKBOX_SECRET');
  console.error('Find the appropriate values for these by logging into your TokBox Dashboard at: https://tokbox.com/account/#/');
  console.error('Then add them to ', path.resolve('.env'), 'or as environment variables' );
  console.error('');
  console.error('=========================================================================================================');
  process.exit();
}

OpenTok = require('opentok');
opentok = new OpenTok(apiKey, secret);
console.log(opentok);
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

/**
 * GET /session redirects to /room/session
 */
app.get('/api/session', (req, res) => {
  res.redirect('/api/room/session');
});

/**
 * GET /room/:name
 */
app.get('/api/room/:name', (req, res) => {
  const roomName = req.params.name;
  var sessionId;
  var token;
  console.log(`attempting to create a session associated with the room: ${roomName}`);

  // if the room name is associated with a session ID, fetch that
  if (roomToSessionIdDictionary[roomName]) {
    sessionId = roomToSessionIdDictionary[roomName];

    // generate token
    token = opentok.generateToken(sessionId);
    res.setHeader('Content-Type', 'application/json');
    res.send({
      apiKey: apiKey,
      sessionId: sessionId,
      token: token
    });
  } else {
    opentok.createSession({ mediaMode: 'routed' }, (err, session) => {
      if (err) {
        console.log(err);
        res.status(500).send({ error: 'createSession error:' + err });
        return;
      }

      // now that the room name has a session associated wit it, store it in memory
      // IMPORTANT: Because this is stored in memory, restarting your server will reset these values
      // if you want to store a room-to-session association in your production application
      // you should use a more persistent storage for them
      roomToSessionIdDictionary[roomName] = session.sessionId;

      // generate token
      token = opentok.generateToken(session.sessionId);
      res.setHeader('Content-Type', 'application/json');
      res.send({
        apiKey: apiKey,
        sessionId: session.sessionId,
        token: token
      });
    });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Holosportsconnect listening to port: ${port}`);
