import React from 'react';
// ReactDOM has been deprecated? instead use createRoot...
import { createRoot } from 'react-dom/client';
import Room from './components/Room';
import { JoinRoom } from './components/JoinRoom';
import socket from 'socket.io-client';

// export const clientSocket = socket(window.location.origin);
// //window.location.origin is an object describing the URL of the page we are on.

// clientSocket.on('connect', () => {
//   console.log('Connected to server');
// });

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <div>
    <Room />
  </div>
);
