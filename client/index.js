import React from 'react';
// ReactDOM has been deprecated? instead use createRoot...
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
//Components:
import Room from './components/Room';
import JoinRoom from './components/JoinRoom';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <div>
      <JoinRoom />
    </div>
  </Provider>
);
