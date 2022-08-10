import socket from 'socket.io-client';
import store, {
  translateMessage,
  addUserToList,
  setUsers,
  notifyOfTyping,
} from './store';

// import { useSelector, useDispatch } from 'react-redux';

export const clientSocket = socket(window.location.origin);
export let returnRoomStatus;

clientSocket.on('connect', () => {
  //promt that the socket is connected
  console.log('Client socket connected to server!');
  //listening for emmited events which trigger function execution:

  clientSocket.on('typing-message', (userName) => {
    store.dispatch(notifyOfTyping(userName));
  });
  clientSocket.on('new-message', (message) => {
    store.dispatch(translateMessage(message));
  });
  clientSocket.on('add-user-to-room', (user) => {
    store.dispatch(addUserToList(user));
    // const soundUserIn = new Audio(
    //   'https://cdn.freesound.org/previews/573/573381_12342220-lq.mp3'
    // );
    // soundUserIn.play();
  });
  clientSocket.on('check-who-is-in-room', (users) => {
    store.dispatch(setUsers(users));
  });
});
