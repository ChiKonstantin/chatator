import React from 'react';

export default function Message(props) {
  return (
    <div className={`message-div-${props.message.messageType}`}>
      <p className='message-author'>{props.message.messageUser}</p>
      <div className={`message-bubble-${props.message.messageType}`}>
        <p>{props.message.message}</p>
      </div>
      <br />
    </div>
  );
}
