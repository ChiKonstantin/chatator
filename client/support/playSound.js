import store from '../store';

export const playSound = function (type) {
  if (store.getState().sound) {
    const adminMessageSound = new Audio(
      'https://cdn.freesound.org/previews/263/263133_2064400-lq.mp3'
    );
    const roommateMessageSound = new Audio(
      'https://cdn.freesound.org/previews/321/321806_2567799-lq.mp3'
    );
    const selfMessageSound = new Audio(
      'https://cdn.freesound.org/previews/585/585257_4530936-lq.mp3'
    );
    const joinChatSound = new Audio(
      'https://cdn.freesound.org/previews/573/573381_12342220-lq.mp3'
    );

    // console.log('sound type:', type);
    if (type === 'admin') {
      adminMessageSound.play();
    }
    if (type === 'self') {
      selfMessageSound.play();
    }

    if (type === 'roommate') {
      roommateMessageSound.play();
    }

    if (type === 'welcome') {
      joinChatSound.play();
    }
  } else {
    // console.log('Sound is off...');
  }
};
