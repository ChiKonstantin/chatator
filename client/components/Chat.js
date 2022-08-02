import React, { useState } from 'react';
import useForm from './hooks/useForm';

export default function Chat() {
  const [values, handleChange] = useForm();
  const [self, setSelf] = useState({ isInRoom: false, userName: 'poop' });
  const [users, setUsers] = useState({});
  const [messages, setMessages] = useState({});
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

  const handleJoinRoom = async function (event) {
    event.preventDefault();
    setSelf({ ...self, isInRoom: true });
    console.log('THIS IS SELF: ', self);
    // //packaging user info
    // const currentUser = {
    //   userName: self.userName,
    //   userRoom: self.userCode,
    //   userLang: self.userLang,
    // };
    // //packaging join message
    // const joinMessage = {
    //   message: `${self.userName} joined the room! 🦜`,
    //   messageLang: 'en',
    //   messageRoom: self.userRoom,
    // };
    // await this.props.joinRoom(currentUser);
    // await this.props.postMessage(joinMessage);
    // await this.props.getUsers();
    // this.setState({
    //   userName: '',
    //   roomCode: '',
    //   userLang: '',
    // });
  };

  return (
    <div className='chat-page'>
      {self.isInRoom ? (
        <div className='room-comp'>
          <h1>ROOM JOINED!</h1>
          <h2>{self.userName}</h2>
          {/* <div>
            <h3>Self info</h3>
            Name: {this.props.self.userName}
            <br />
            Language: {this.props.self.userLang}
            <br />
            Room: {this.props.self.roomCode}
            <br />
          </div>
          <div>
            <h3>Users in this room:</h3>
            {this.props.users.map((user) => {
              return `${user.userName} - ${user.userLang}, `;
            })}
            <div>---</div>
          </div>
          <form onSubmit={this.handleSubmit} className='form'>
            <input
              type='text'
              id='entry'
              name='newMessage'
              value={this.state.newMessage}
              onChange={this.handleChange}
              placeholder='Message here'
            />
            <button type='submit'>send</button>
          </form>
          <button
            onClick={() => {
              this.testWhoIsOnline();
            }}
          >
            check who is online
          </button>
          <div className='messages_wrapper'>{this.renderMessages()}</div> */}
        </div>
      ) : (
        <div className='waiting-room'>
          <h3 key='div'>JOIN ROOM!</h3>
          <form className='join-form' onSubmit={handleJoinRoom} key='form'>
            <input
              type='text'
              name='roomCode'
              onChange={handleChange}
              value={values.roomCode || ''}
              placeholder='Room Code'
            />
            <input
              type='text'
              name='userName'
              onChange={handleChange}
              value={values.userName || ''}
              placeholder='Name'
            />
            {/* <select
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
            </select> */}
            <button className='submit-button' type='submit'>
              SUBMIT
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
