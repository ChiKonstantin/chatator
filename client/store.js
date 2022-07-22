import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import axios from 'axios';
import { clientSocket } from './clientSocket';

const ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE';
const SET_SELF = 'SET_SELF';
const SET_USERS = 'SET_USERS';
const SET_ALL_MESSAGES = 'SET_ALL_MESSAGES';

let self = {};

export const addNewMessage = (message) => {
  return {
    type: ADD_NEW_MESSAGE,
    message,
  };
};

export const setSelf = (user) => {
  self = user;
  console.log('###SELF LOCALLY', self);
  return {
    type: SET_SELF,
    self: user,
  };
};

export const setUsers = (users) => {
  return {
    type: SET_USERS,
    //users must be an array of objects
    users: users,
  };
};

export const joinRoom = (user) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post('/api/users', user);
      console.log('info to set self:', data);
      dispatch(setSelf(data));
      // history.push('/');
      clientSocket.emit('user-joined');
      //when someone joins everyone re-sets users
    } catch (error) {
      console.log(error);
    }
  };
};

export const getUsers = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get('/api/users');
      console.log('get user fetched users:', data);
      dispatch(setUsers(data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const postMessage = (message) => {
  return async (dispatch) => {
    try {
      // const { data } = await axios.post('/api/messages', message);
      dispatch(addNewMessage(message));
      clientSocket.emit('new-message', message);
    } catch (error) {
      console.log(error);
    }
  };
};

export const confirmUserPresence = () => {
  return (dispatch) => {
    try {
      dispatch(
        postMessage({
          message: `${self.userName} is here!`,
          messageLang: 'en',
          roomCode: self.roomCode,
          userId: self.id,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const translateMessage = (inputMessage) => {
  return async (dispatch) => {
    try {
      if (inputMessage.messageLang !== self.userLang) {
        const res = await fetch('https://libretranslate.de/translate', {
          method: 'POST',
          body: JSON.stringify({
            q: inputMessage.message,
            source: inputMessage.messageLang,
            target: self.userLang,
            format: 'text',
          }),
          headers: { 'Content-Type': 'application/json' },
        });
        let translatedRes = await res.json();
        const translatedMessage = {
          userId: inputMessage.userId,
          message: translatedRes.translatedText,
          messageLang: self.userLang,
          roomCode: self.roomCode,
        };
        console.log('Translated message: ', translatedMessage);
        dispatch(addNewMessage(translatedMessage));
      } else {
        console.log('Message does not need tranlation');
        dispatch(addNewMessage(inputMessage));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

const initialState = {
  self: {},
  users: [],
  //the messages should be in current user's language
  messages: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NEW_MESSAGE:
      return { ...state, messages: [...state.messages, action.message] };
    case SET_SELF:
      return { ...state, self: action.self };
    case SET_USERS:
      return { ...state, users: action.users };
    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export default store;
