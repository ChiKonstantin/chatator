import socket from 'socket.io-client';
import store, {
  addNewMessage,
  translateMessage,
  getUsers,
  postMessage,
  confirmUserPresence,
} from './store';

export const clientSocket = socket(window.location.origin);

clientSocket.on('connect', () => {
  //promt that the socket is connected
  console.log('Socket connected to server');
  //listening for emmited events which trigger function execution:
  clientSocket.on('new-message', (inputMessage) => {
    console.log('clientSocket received new-message event', inputMessage);
    store.dispatch(translateMessage(inputMessage));
  });
  clientSocket.on('user-joined', () => {
    store.dispatch(getUsers());
    console.log('clientSocket received user-joined event');
  });
  clientSocket.on('test-users', () => {
    store.dispatch(confirmUserPresence());
  });
});
