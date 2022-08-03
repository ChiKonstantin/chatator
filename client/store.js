import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import axios from 'axios';
import { clientSocket } from './clientSocket';
import { languages } from './langList';

const ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE';
const SET_SELF = 'SET_SELF';

export const addNewMessage = function (message) {
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
      if (message.messageRoom === localSelf.userRoom) {
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
          const translatedMessage = {
            message: translatedRes.translatedText,
            messageLang: localSelf.userLang,
            messageRoom: localSelf.userRoom,
            messageUser: message.messageUser,
            messageType: message.messageType,
          };
          dispatch(addNewMessage(translatedMessage));
        } else {
          console.log('Message does not need translation');
          dispatch(addNewMessage(message));
        }
      } else {
        console.log('Sorry, message belongs in a different room.');
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const joinedRoomNotify = function () {
  const [langName] = languages.filter(
    (lang) => lang.code === localSelf.userLang
  );
  console.log('LANG NAME:', langName);
  const joinedMessage = {
    message: `${localSelf.userName} joined this room, they speak ${langName.name}.`,
    messageLang: 'en',
    messageRoom: localSelf.userRoom,
    messageUser: '📢',
    messageType: 'admin',
  };
  clientSocket.emit(`new-message`, joinedMessage);
};

const initialState = {
  //the messages should be in current user's language
  messages: [],
  self: { isInRoom: false },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NEW_MESSAGE:
      return { ...state, messages: [...state.messages, action.message] };
    case SET_SELF:
      return { ...state, self: action.self };
    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export default store;
