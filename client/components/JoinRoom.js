import React from 'react';
import { joinRoom, postMessage, getUsers } from '../store';
import { connect } from 'react-redux';
import history from '../history';
import { clientSocket } from '../clientSocket';

export class JoinRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      roomCode: '',
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

  async handleSubmit(event) {
    event.preventDefault();
    //packaging user info
    const currentUser = {
      userName: this.state.userName,
      roomCode: this.state.roomCode,
      userLang: this.state.userLang,
    };
    //packaging join message
    const joinMessage = {
      message: `${this.state.userName} joined the room! 🦜`,
      messageLang: 'en',
      roomCode: this.state.roomCode,
    };
    await this.props.joinRoom(currentUser);
    await this.props.postMessage(joinMessage);
    await this.props.getUsers();
    console.log('Store:', this.props);

    // this.props.history.push(`/room`);
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
        <h3 key='div'>JOIN ROOM!</h3>
        <form className='join-form' onSubmit={this.handleSubmit} key='form'>
          <input
            name='roomCode'
            value={this.state.roomCode}
            onChange={this.handleChange}
            placeholder='Room Code'
          />
          <input
            name='userName'
            value={this.state.userName}
            onChange={this.handleChange}
            placeholder='Name'
          />
          <select
            name='userLang'
            value={this.state.userLang}
            onChange={this.handleChange}
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
    );
  }
}

const mapState = (state) => {
  return {
    state,
  };
};

const mapDispatch = (dispatch) => {
  console.log('Mapping dispatch to props in JoinRoom');
  return {
    joinRoom: (user) => dispatch(joinRoom(user)),
    postMessage: (message) => dispatch(postMessage(message)),
    getUsers: () => dispatch(getUsers()),
  };
};

export default connect(mapState, mapDispatch)(JoinRoom);
