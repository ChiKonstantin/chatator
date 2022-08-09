import React from 'react';
import { Route, Routes } from 'react-router-dom';
import JoinRoom from './JoinRoom';
import Room from './Room';
import JoinWLink from './JoinWLink';
import Chat from './Chat';

export default function Main() {
  return (
    <div className='main'>
      <Routes>
        <Route path='/' element={<Chat />} />
        <Route path='/join/:roomCode' element={<JoinWLink />} />
      </Routes>
    </div>
  );
}
