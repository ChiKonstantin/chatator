import React, { useState } from 'react';
// import { clientSocket } from '../clientSocket';
import Message from './Message';
import { clientSocket } from '../clientSocket';
import { useSelector, useDispatch } from 'react-redux';
import { postMessage, translateMessage, setSelf } from '../store';

export default function Chat() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({});
  // const [self, setSelf] = useState({ isInRoom: false });
  // const [messages, setMessages] = useState([]);
  const messages = useSelector((state) => state.messages);
  const self = useSelector((state) => state.self);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' },
    { code: 'az', name: 'Azerbaijani' },
    { code: 'zh', name: 'Chinese' },
    { code: 'cs', name: 'Czech' },
    { code: 'da', name: 'Danish' },
    { code: 'nl', name: 'Dutch' },
    { code: 'eo', name: 'Esperanto' },
    { code: 'fi', name: 'Finnish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'el', name: 'Greek' },
    { code: 'he', name: 'Hebrew' },
    { code: 'hi', name: 'Hindi' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'id', name: 'Indonesian' },
    { code: 'ga', name: 'Irish' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'fa', name: 'Persian' },
    { code: 'pl', name: 'Polish' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'sk', name: 'Slovak' },
    { code: 'es', name: 'Spanish' },
    { code: 'sv', name: 'Swedish' },
    { code: 'tr', name: 'Turkish' },
    { code: 'uk', name: 'Ukranian' },
    { code: 'vi', name: 'Vietnamese' },
  ];
  //Handling form input
  const handleChange = (event) => {
    event.persist();
    setValues((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  //supporting functions:
  const handleJoinRoom = async function (event) {
    // add a check for no more than 2 people in the room currently
    // add a check for username in the room... should only be fired after room is checked.
    event.preventDefault();
    const selfInfo = {
      isInRoom: true,
      userName: values.userName,
      userRoom: values.userRoom,
      userLang: values.userLang,
    };
    dispatch(setSelf(selfInfo));
    console.log('SELF FROM CHAT', self);
    //packaging join message
    const joinMessage = {
      message: `${values.userName} joined the room! 🦜`,
      messageLang: 'en',
      messageRoom: values.userRoom,
      messageUser: '📢',
      messageType: 'admin',
    };
    sendMessage(joinMessage);
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
        // messageType: 'user',
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

          <div>
            <h3>Users in this room: {self.userName}</h3>
            {/* add a function to check who is in the room */}
            <div>---</div>
          </div>

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

          <div className='messages_wrapper'>{renderMessages(messages)}</div>
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
