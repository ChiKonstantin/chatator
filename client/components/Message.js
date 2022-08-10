import React, { useState } from 'react';

export default function Message(props) {
  const message = props.message;
  const [showFlag, setShowFlag] = useState({
    show: false,
  });
  const testName = 'TEST NAME';

  const originalSwitch = function () {
    setShowFlag({ show: !showFlag.show });
  };

  const renderOriginal = function () {
    if (showFlag.show) {
      return message.messageOriginal;
    } else {
    }
    return '';
  };

  const renderOriginalButton = function () {
    if (message.messageType !== 'admin' && message.messageOriginal) {
      return (
        <div>
          <button onClick={originalSwitch}>See original</button>
          <div>{renderOriginal()}</div>
        </div>
      );
    } else {
      return '';
    }
  };
  return (
    <div className={`message-div-${message.messageType}`}>
      <p className='message-author'>{message.messageUser}</p>
      <div className={`message-bubble-${message.messageType}`}>
        <p>{message.message}</p>
        {renderOriginalButton()}
      </div>
      <br />
    </div>
  );
}
