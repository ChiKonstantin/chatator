import React from 'react';
import { Route, Routes } from 'react-router-dom';
import JoinRoom from './JoinRoom';
import Room from './Room';

const Main = () => {
  return (
    <div className='main'>
      <Routes>
        <Route path='/' element={<JoinRoom />} />
        <Route path='/room' element={<Room />} />
      </Routes>
    </div>
  );
};

export default Main;
