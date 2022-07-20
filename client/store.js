import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import axios from 'axios';
import { clientSocket } from './clientSocket';

const ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE';
const SET_SELF = 'SET_SELF';
const SET_USERS = 'SET_USERS';

export const addNewMessage = (message) => {
  return {
    type: ADD_NEW_MESSAGE,
    message,
  };
};

export const setSelf = (user) => {
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
      console.log('joinRoom sent user info:', data);
      dispatch(setSelf(data));
      // clientSocket.emit('user-joined', data);
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

export const postMessage = (inputMessage) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post('/api/messages', inputMessage);
      dispatch(addNewMessage(data));
      console.log('postMessage sent message', data);
      // clientSocket.emit('new-message', data);
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
      return { ...state, self: action.user };
    case SET_USERS:
      return { ...state, users: action.users };
    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export default store;
