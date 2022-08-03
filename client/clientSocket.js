import socket from 'socket.io-client';
import store, { translateMessage } from './store';
// import { useSelector, useDispatch } from 'react-redux';

export const clientSocket = socket(window.location.origin);

// can't run hooks here... wha wha wha
// const dispatch = useDispatch();
// const self = useSelector((state) => state.self);

clientSocket.on('connect', () => {
  //promt that the socket is connected
  console.log('Socket connected to server!');
  //listening for emmited events which trigger function execution:
  clientSocket.on('new-message', (message) => {
    console.log('clientSocket received new-message event', message);
    store.dispatch(translateMessage(message, self));
  });
  clientSocket.on('user-joined', () => {
    // store.dispatch(getUsers());
    console.log('clientSocket received user-joined event');
  });
  clientSocket.on('test-users', () => {
    // store.dispatch(confirmUserPresence());
  });
});
