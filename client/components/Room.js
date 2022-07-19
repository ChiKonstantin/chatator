import React from 'react';
import axios from 'axios';
import Message from './Message';

export default class Room extends React.Component {
  constructor() {
    super();
    this.state = {
      roomId: 123,
      user1: 'Kostya',
      user2: 'Tracy',
      lang1: 'ru',
      lang2: 'en',
      newMessage: '',
      allMessages: [],
      languages: [
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
      ],
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
    const res = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: this.state.newMessage,
        source: 'en',
        target: 'es',
        format: 'text',
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    // console.log(await res.json());
    let translatedMessage = await res.json();
    // console.log('HERES A TRANSLATION', translatedMessage.translatedText);

    console.log('new message:', this.state.newMessage);
    let messageBufferArr = this.state.allMessages.slice();
    messageBufferArr.push(translatedMessage.translatedText);
    // console.log('message buffer array:', messageBufferArr);
    await this.setState({ newMessage: '', allMessages: messageBufferArr });
    // console.log('in all messages:', this.state.allMessages);
  }

  renderMessages() {
    const messagesArr = this.state.allMessages.slice();
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
