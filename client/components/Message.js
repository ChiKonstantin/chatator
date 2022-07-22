import React from 'react';

export default function Message(props) {
  return (
    <div>
      <div className='messageBubble'>
        <p>{props.message.message}</p>
      </div>
      <br />
    </div>
  );
}
