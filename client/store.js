import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import axios from 'axios';
import { clientSocket } from './clientSocket';

const ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE';
const SET_SELF = 'SET_SELF';

export const addNewMessage = function (message) {
  return {
    type: ADD_NEW_MESSAGE,
    message,
  };
};

export const setSelf = function (self) {
  return {
    type: SET_SELF,
    self,
  };
};

export const postMessage = function (message) {
  return async function (dispatch) {
    try {
      dispatch(addNewMessage(message));
      clientSocket.emit('new-message', message);
    } catch (error) {
      console.log(error);
    }
  };
};

// export const confirmUserPresence = function () {
//   return function (dispatch) {
//     try {
//       dispatch(
//         postMessage({
//           message: `${self.userName} is here!`,
//           messageLang: 'en',
//           roomCode: self.roomCode,
//           userId: self.id,
//         })
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   };
// };

export const translateMessage = (message) => {
  return async function (dispatch) {
    console.log('THIS IS SELF IN TRANSLATE', self);
    try {
      if (message.messageLang !== self.userLang) {
        const res = await fetch('https://libretranslate.de/translate', {
          method: 'POST',
          body: JSON.stringify({
            q: message.message,
            source: message.messageLang,
            target: self.userLang,
            format: 'text',
          }),
          headers: { 'Content-Type': 'application/json' },
        });
        let translatedRes = await res.json();
        const translatedMessage = {
          message: translatedRes.translatedText,
          messageLang: self.userLang,
          messageRoom: self.roomCode,
          messageUser: self.userName,
          messageType: 'user',
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
