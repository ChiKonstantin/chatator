import React, { useState } from 'react';
import { languages } from '../support/langList';
import { useSelector, useDispatch } from 'react-redux';
import { clientSocket } from '../clientSocket';
import { setSelf } from '../store';
import { useNavigate } from 'react-router-dom';

export default function JoinWLink() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({});
  const self = useSelector((state) => state.self);
  let navigate = useNavigate();

  //Handling form input
  const handleChange = (event) => {
    event.persist();
    setValues((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };
  const getRoomCodeFromUrl = function () {
    try {
      const url = new URL(window.location.href);
      let pathname = url.pathname;
      let roomCode = pathname.replace('/join/', '');
      return roomCode;
    } catch (error) {
      console.log(error);
    }
  };

  const handleJoinRoomWLink = function (event) {
    event.preventDefault();

    clientSocket.emit('check-room-code', getRoomCodeFromUrl());
    //check if roomCode exists
    //if not give an error
    //if roomCode exists then join the room
    //joining room is basically setSelf and emit event to join room

    clientSocket.on('check-room-response', (response) => {
      if (response === 1) {
        const randomUserId = Math.floor(Math.random() * 100000);
        const [langName] = languages.filter(
          (lang) => lang.code === values.joinUserLang
        );
        const selfInfo = {
          userId: randomUserId,
          isInRoom: true,
          userName: values.joinUserName,
          userRoom: getRoomCodeFromUrl(),
          userLang: values.joinUserLang,
          userLangName: langName.name,
        };
        dispatch(setSelf(selfInfo));
        clientSocket.emit('join-room', selfInfo);
        navigate('/');
      } else {
        console.log('Sorry, there is no such room...');
        alert('Sorry, there is no such room...');
      }
    });
  };
  return (
    <div>
      <h3>🥔+🥔 JOIN ROOM {getRoomCodeFromUrl()}!</h3>
      <form
        className='join-form'
        onSubmit={handleJoinRoomWLink}
        key='join-form'
      >
        {/* <input
          name='joinUserRoom'
          onChange={handleChange}
          value={values.joinUserRoom || ''}
          placeholder='Room Code'
        /> */}
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
  );
}