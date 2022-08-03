import socket from 'socket.io-client';
import store, { translateMessage } from './store';
// import { useSelector, useDispatch } from 'react-redux';

export const clientSocket = socket(window.location.origin);

clientSocket.on('connect', () => {
  //promt that the socket is connected
  console.log('Socket connected to server!');
  //listening for emmited events which trigger function execution:
  clientSocket.on('new-message', (message) => {
    console.log('clientSocket received new-message event', message);
    store.dispatch(translateMessage(message));
  });
});
