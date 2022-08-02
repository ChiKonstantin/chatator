import React from 'react';

export default function Message(props) {
  return (
    <div>
      <p>{props.message.messageUser}</p>
      <div className='messageBubble'>
        <p>{props.message.message}</p>
      </div>
      <br />
    </div>
  );
}
