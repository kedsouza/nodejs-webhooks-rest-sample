#!/usr/bin/env node

import { app } from './app';
import { createDatabase } from './helpers/dbHelper';

createDatabase();

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log('Express server listening on port ' + server.address().port);
});

// Added websocket server to use already created server.
import io from 'socket.io';
import { subscriptionConfiguration, msalConfiguration } from './constants';

export const ioServer = io(server, {
  cors: {
    origin: [
      msalConfiguration.redirectUri.substring(0, msalConfiguration.redirectUri.lastIndexOf('/')),
      subscriptionConfiguration.notificationUrl.substring(0, subscriptionConfiguration.notificationUrl.lastIndexOf('/'))],
    methods: ['GET', 'POST']
  }
});

// Socket event
ioServer.on('connection', socket => {
  socket.on('create_room', subscriptionId => {
    socket.join(subscriptionId);
  });
});