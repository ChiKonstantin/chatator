import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import JoinRoom from './JoinRoom';
import Room from './Room';
import { connect } from 'react-redux';

const Main = () => {
  return (
    <div className='main'>
      <Router>
        <Routes>
          <Route exact path='/' element={<JoinRoom />} />
          <Route path='/room' element={<Room />} />
        </Routes>
      </Router>
    </div>
  );
};

export default Main;
