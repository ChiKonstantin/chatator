import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import axios from 'axios';
import { clientSocket } from './clientSocket';
import { languages } from './support/langList';

const ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE';
const SET_SELF = 'SET_SELF';
const ADD_USER_TO_LIST = 'ADD_USER_TO_LIST';
const SET_USERS = 'SET_USERS';
const SET_TYPING_STATUS = 'SET_TYPING_STATUS';

export const addNewMessage = function (message) {
  console.log('ADDING NEW MESSAGE:', message);
  return {
    type: ADD_NEW_MESSAGE,
    message,
  };
};

let localSelf = {};
export const setSelf = function (self) {
  localSelf = self;
  return {
    type: SET_SELF,
    self,
  };
};

export const addUserToList = function (user) {
  console.log('ADDING NEW USER:', user);
  return {
    type: ADD_USER_TO_LIST,
    user,
  };
};

export const setUsers = function (users) {
  console.log('SETTING USERS', users);
  return {
    type: SET_USERS,
    users,
  };
};

export const setTypingStatus = function (status) {
  // console.log('SETTING TYPING STATUS', status);
  return {
    type: SET_TYPING_STATUS,
    status,
  };
};

//posts Self message in Self view, sends message to recipient for translation.
export const postMessage = function (message) {
  return async function (dispatch) {
    try {
      dispatch(addNewMessage(message));
      clientSocket.emit(`new-message`, message);
    } catch (error) {
      console.log(error);
    }
  };
};

export const translateMessage = (message) => {
  return async function (dispatch) {
    try {
      if (message.messageLang !== localSelf.userLang) {
        const res = await fetch('https://libretranslate.de/translate', {
          method: 'POST',
          body: JSON.stringify({
            q: message.message,
            source: message.messageLang,
            target: localSelf.userLang,
            format: 'text',
          }),
          headers: { 'Content-Type': 'application/json' },
        });
        let translatedRes = await res.json();
        let assignedType = 'roommate';
        if (message.messageType === 'admin') {
          assignedType = 'admin';
        }
        const translatedMessage = {
          message: translatedRes.translatedText,
          messageLang: localSelf.userLang,
          messageRoom: localSelf.userRoom,
          messageUser: message.messageUser,
          messageType: assignedType,
        };
        dispatch(addNewMessage(translatedMessage));
      } else {
        console.log('Message does not need translation');
        dispatch(addNewMessage(message));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

let timer;
export const notifyOfTyping = function (userName) {
  return function (dispatch) {
    try {
      clearTimeout(timer);

      dispatch(
        setTypingStatus({
          typing: true,
          userName: userName,
        })
      );

      timer = setTimeout(() => {
        dispatch(
          setTypingStatus({
            typing: false,
            userName: '',
          })
        );
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };
};

const initialState = {
  //the messages should be in current user's language
  messages: [],
  self: { isInRoom: false },
  users: [],
  typingStatus: { typing: false, userName: '' },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NEW_MESSAGE:
      return { ...state, messages: [...state.messages, action.message] };
    case SET_SELF:
      return { ...state, self: action.self };
    case ADD_USER_TO_LIST:
      return { ...state, users: [...state.users, action.user] };
    case SET_USERS:
      return { ...state, users: action.users };
    case SET_TYPING_STATUS:
      return { ...state, typingStatus: action.status };
    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export default store;
