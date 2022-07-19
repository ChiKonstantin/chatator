import socket from 'socket.io-client';
import store, { addNewMessage } from './store';

export const clientSocket = socket(window.location.origin);

clientSocket.on('connect', () => {
  //promt that the socket is connected
  console.log('Socket connected to server');
  //listening for emmited events which trigger function execution:
  clientSocket.on('new-message', (inputMessage) => {
    store.dispatch(addNewMessage(inputMessage));
  });
});
