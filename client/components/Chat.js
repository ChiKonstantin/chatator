import React, { useState } from 'react';
// import { clientSocket } from '../clientSocket';
import Message from './Message';
import { clientSocket } from '../clientSocket';
import { useSelector, useDispatch } from 'react-redux';
import { postMessage, setSelf, joinedRoomNotify } from '../store';
import { languages } from '../support/langList';

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
  const handleJoinRoom = function (event) {
    // add a check for no more than 2 people in the room currently
    // add a check for username in the room... should only be fired after room is checked.
    event.preventDefault();
    const [langName] = languages.filter(
      (lang) => lang.code === values.userLang
    );
    console.log(langName);
    const selfInfo = {
      isInRoom: true,
      userName: values.userName,
      userRoom: values.userRoom,
      userLang: values.userLang,
      userLangName: langName.name,
    };
    dispatch(setSelf(selfInfo));
    clientSocket.emit('join-room', selfInfo);
    // joinedRoomNotify();
    // add a function to check who is in the room
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
        messageType: 'user',
      };
      sendMessage(newMessage);
      setValues({});
    }
  };

  const sendMessage = function (message) {
    dispatch(postMessage(message));
  };

  //add 'accept message' function
  const acceptMessage = function () {};

  //add room attendance function
  const checkAttendance = function () {};

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
      console.log('THIS IS USERS FROM FUNC', users);
      return users.map((user) => {
        <div>
          {user.userName} speaks {user.userLangName}
        </div>;
      });
    }
  };

  return (
    <div className='chat-page'>
      {self.isInRoom ? (
        <div className='room-comp'>
          <div>
            <h1>Welcome, {self.userName}!</h1>
            <h2>Here's some info about you:</h2>
            <h3>
              Your name is {self.userName}
              <br /> Your room code is: {self.userRoom}
              <br /> And your language is: {self.userLang}
              <br />
            </h3>
          </div>

          {/* <div className='users-wrapper'>
            <h3>Users in this room: </h3>
            {renderUsers(users)}
         
            <div>---</div>
          </div> */}

          <form
            // onSubmit={(event) => sendMessage(values.newMessage, event)}
            onSubmit={(event) => handleSendMessage(values.newMessage, event)}
            className='form'
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

          {/* <button
            onClick={() => {
              this.testWhoIsOnline();
            }}
          >
            check who is online
          </button> */}

          <div className='messages-wrapper'>{renderMessages(messages)}</div>
        </div>
      ) : (
        <div className='waiting-room'>
          <h3 key='div'>JOIN ROOM!</h3>
          <form className='join-form' onSubmit={handleJoinRoom} key='form'>
            <input
              name='userRoom'
              onChange={handleChange}
              value={values.userRoom || ''}
              placeholder='Room Code'
            />
            <input
              type='text'
              name='userName'
              onChange={handleChange}
              value={values.userName || ''}
              placeholder='Name'
            />
            <select
              name='userLang'
              onChange={handleChange}
              value={values.userLang || ''}
              placeholder='Language'
            >
              {languages.map((language) => (
                <option value={language.code} key={`lang_${language.code}`}>
                  {language.name}
                </option>
              ))}
            </select>
            <button className='submit-button' type='submit'>
              SUBMIT
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
