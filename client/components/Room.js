import React from 'react';
import axios from 'axios';
import Message from './Message';
import { connect } from 'react-redux';
import { postMessage } from '../store';

export class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderMessages = this.renderMessages.bind(this);
  }

  handleChange(event) {
    this.setState({
      newMessage: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.props.postMessage(newMessage);
    // const res = await fetch('https://libretranslate.de/translate', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     q: this.state.newMessage,
    //     source: 'en',
    //     target: 'es',
    //     format: 'text',
    //   }),
    //   headers: { 'Content-Type': 'application/json' },
    // });
    // // console.log(await res.json());
    // let translatedMessage = await res.json();
    // // console.log('HERES A TRANSLATION', translatedMessage.translatedText);
    // console.log('new message:', this.state.newMessage);
    // let messageBufferArr = this.state.allMessages.slice();
    // messageBufferArr.push(translatedMessage.translatedText);
    // // console.log('message buffer array:', messageBufferArr);
    // await this.setState({ newMessage: '', allMessages: messageBufferArr });
    // // console.log('in all messages:', this.state.allMessages);
  }

  renderMessages() {
    console.log('THIS PROPS MESSAGES: ', this.props.messages);
    const messagesArr = this.props.messages;
    if (messagesArr === undefined || messagesArr.length === 0) {
      return '...';
    } else {
      return messagesArr.map((message) => <Message message={message} />);
    }
  }

  render() {
    return (
      <div>
        <div className='messages_wrapper'>{this.renderMessages()}</div>
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
