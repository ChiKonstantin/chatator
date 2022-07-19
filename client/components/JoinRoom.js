import React from 'react';
import {
  joinRoom,
  postMessage,
  getUsers,
} from '../../../chatator/client/store';
import { connect } from 'react-redux';

export class JoinRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      roomCode: '',
      userName: '',
      userLang: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const currentUser = {
      userName: this.state.userName,
      roomCode: this.state.roomCode,
      userLang: this.state.userLang,
    };
    const joinMessage = {
      userId: user.id,
      message: `${user.userName} joined the room! 🦜`,
      messageLang: 'en',
      roomCode: user.roomCode,
    };
    // this.props.joinRoom(currentUser);
    // this.props.postMessage(joinMessage);
    // this.props.getUsers();
    console.log('SUBMITTED, language:', currentUser);
  }

  render() {
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
    return (
      <div>
        <h3>JOIN ROOM!</h3>
        <form className='join-form' onSubmit={this.handleSubmit}>
          <input
            name='roomCode'
            value={this.state.roomCode}
            onChange={this.handleChange}
          />
          <input
            name='userName'
            value={this.state.userName}
            onChange={this.handleChange}
          />
          <select
            name='userLang'
            value={this.state.userLang}
            onChange={this.handleChange}
          >
            {languages.map((language) => (
              <option value={language.code}>{language.name}</option>
            ))}
          </select>
          <button className='submit-button' type='submit'>
            SUBMIT
          </button>
        </form>
      </div>
    );
  }
}

// const dispatchMapper = (dispatch) => {
//   return {
//     joinRoom: (user) => dispatch(joinRoom(user)),
//     postMessage: (message) => dispatch(postMessage(message)),
//     getUsers: () => dispatch(getUsers()),
//   };
// };

// export default connect(stateMapper, dispatchMapper)(JoinRoom);