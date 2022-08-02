import React from 'react';
import axios from 'axios';
import Message from './Message';
import { connect } from 'react-redux';
import { postMessage } from '../store';
import { clientSocket } from '../clientSocket';

export class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderMessages = this.renderMessages.bind(this);
    this.testWhoIsOnline = this.testWhoIsOnline.bind(this);
  }

  handleChange(event) {
    this.setState({
      newMessage: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const message = {
      message: this.state.newMessage,
      messageLang: this.props.self.userLang,
      roomCode: this.props.self.roomCode,
      userId: this.props.self.id,
    };
    this.props.postMessage(message);
    this.setState({ newMessage: '' });
  }

  renderMessages() {
    const messagesArr = this.props.messages;
    if (messagesArr === undefined || messagesArr.length === 0) {
      return '...';
    } else {
      return messagesArr.map((message) => <Message message={message} />);
    }
  }

  testWhoIsOnline() {
    console.log('TESTING WHO IS ONLINE');
    clientSocket.emit('test-users');
  }

  render() {
    return (
      <div>
        <div>
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
        <div className='messages_wrapper'>{this.renderMessages()}</div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    self: state.self,
    users: state.users,
    messages: state.messages,
  };
};

const mapDispatch = (dispatch) => {
  return {
    postMessage: (message) => dispatch(postMessage(message)),
  };
};

export default connect(mapState, mapDispatch)(Room);
