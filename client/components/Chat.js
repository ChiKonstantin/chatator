import React, { useState } from 'react';
// import { clientSocket } from '../clientSocket';
import Message from './Message';
import { clientSocket } from '../clientSocket';
import { useSelector, useDispatch } from 'react-redux';
import { postMessage, setSelf, joinedRoomNotify } from '../store';
import { languages } from '../support/langList';
import UsersList from './UsersList';
import { checkRoomStatus } from '../clientSocket';

export default function Chat() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({});
  const messages = useSelector((state) => state.messages);
  const self = useSelector((state) => state.self);
  const users = useSelector((state) => state.users);

  //Handling form input
  const handleChange = (event) => {
    event.persist();
    setValues((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  //supporting functions:
  const handleCreateRoom = function (event) {
    event.preventDefault();
    const randomUserId = Math.floor(Math.random() * 100000);
    const randomRoomCode = Math.floor(Math.random() * 100000).toString();
    const [langName] = languages.filter(
      (lang) => lang.code === values.newUserLang
    );
    const selfInfo = {
      userId: randomUserId,
      isInRoom: true,
      userName: values.newUserName,
      userRoom: randomRoomCode,
      userLang: values.newUserLang,
      userLangName: langName.name,
    };
    dispatch(setSelf(selfInfo));
    clientSocket.emit('join-room', selfInfo);
    // joinedRoomNotify();
    // add a function to check who is in the room
  };

  const handleJoinRoom = function (event) {
    event.preventDefault();
    clientSocket.emit('check-room-code', values.joinUserRoom);
    //check if roomCode exists
    //if not give an error
    //if roomCode exists then join the room
    //joining room is basically setSelf and emit event to join room

    clientSocket.on('check-room-response', (response) => {
      console.log('**************', response);
      if (response === 1) {
        const randomUserId = Math.floor(Math.random() * 100000);
        const [langName] = languages.filter(
          (lang) => lang.code === values.joinUserLang
        );
        const selfInfo = {
          userId: randomUserId,
          isInRoom: true,
          userName: values.joinUserName,
          userRoom: values.joinUserRoom,
          userLang: values.joinUserLang,
          userLangName: langName.name,
        };
        dispatch(setSelf(selfInfo));
        clientSocket.emit('join-room', selfInfo);
      } else {
        console.log('Sorry, there is no such room. Please try again.');
      }
    });
  };

  const handleSendMessage = function (message, event) {
    event.preventDefault();
    if (message === '' || message === undefined) {
      console.log('Cannot send an empty message, sorry.');
    } else {
      const newMessage = {
        message: message,
        messageLang: self.userLang,
        messageRoom: self.userRoom,
        messageUser: self.userName,
        messageType: 'self',
      };
      // sendMessage(newMessage);
      dispatch(postMessage(newMessage));
      setValues({});
    }
  };

  const renderMessages = function (messages) {
    if (messages === undefined || messages.length === 0) {
      return '...';
    } else {
      return messages.map((message) => <Message message={message} />);
    }
  };

  const renderUsers = function (users) {
    if (users === undefined || users.length === 0) {
      return '~~~';
    } else {
      return users.map((user) => <UsersList user={user} />);
    }
  };

  return (
    <div className='chat-room'>
      {self.isInRoom ? (
        <div className='room-comp'>
          <div>
            <h1>Welcome, {self.userName}!</h1>
            <h2>Here's some info about you:</h2>
            <h3>
              Your name is {self.userName}
              <br /> Your room code is: {self.userRoom}
              <br /> And your language is: {self.userLangName}
              <br />
            </h3>
          </div>
          <div>Users in the room:</div>
          <ul className='users-wrapper'>{renderUsers(users)}</ul>
          <div>---</div>

          <form
            onSubmit={(event) => handleSendMessage(values.newMessage, event)}
            className='chat-form'
          >
            <input
              type='text'
              id='entry'
              name='newMessage'
              value={values.newMessage || ''}
              onChange={handleChange}
              placeholder='Message here'
            />
            <button type='submit'>send</button>
          </form>

          <div className='messages-wrapper'>{renderMessages(messages)}</div>
        </div>
      ) : (
        <div className='waiting-room'>
          <h3>🥔 CREATE NEW ROOM!</h3>
          <form
            className='create-room-form'
            onSubmit={handleCreateRoom}
            key='create-room-form'
          >
            <input
              type='text'
              name='newUserName'
              onChange={handleChange}
              value={values.newUserName || ''}
              placeholder='Your Name'
            />
            <select
              name='newUserLang'
              onChange={handleChange}
              value={values.newUserLang || ''}
              placeholder='Language'
            >
              {languages.map((language) => (
                <option value={language.code} key={`lang_${language.code}`}>
                  {language.name}
                </option>
              ))}
            </select>
            <button className='submit-button' type='submit'>
              CREATE ROOM
            </button>
          </form>
          <h4>or</h4>
          <h3>🥔+🥔 JOIN EXISTING ROOM!</h3>
          <form className='join-form' onSubmit={handleJoinRoom} key='join-form'>
            <input
              name='joinUserRoom'
              onChange={handleChange}
              value={values.joinUserRoom || ''}
              placeholder='Room Code'
            />
            <input
              type='text'
              name='joinUserName'
              onChange={handleChange}
              value={values.joinUserName || ''}
              placeholder='Your Name'
            />
            <select
              name='joinUserLang'
              onChange={handleChange}
              value={values.joinUserLang || ''}
              placeholder='Language'
            >
              {languages.map((language) => (
                <option value={language.code} key={`lang_${language.code}`}>
                  {language.name}
                </option>
              ))}
            </select>
            <button className='submit-button' type='submit'>
              JOIN ROOM
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
