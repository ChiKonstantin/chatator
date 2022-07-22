import React from 'react';

// ReactDOM has been deprecated? instead use createRoot...
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
// import { Router } from 'react-router';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import store from './store';
//Components:
import Room from './components/Room';
import JoinRoom from './components/JoinRoom';
import Main from './components/Main';
import history from './history';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    {/* <Router history={history}>
      <Routes>
        <Route path='/' element={<JoinRoom />} />
        <Route path='/room' element={<Room />} />
      </Routes>
    </Router> */}
    <>
      <Room />
      <JoinRoom />
    </>
  </Provider>
);
