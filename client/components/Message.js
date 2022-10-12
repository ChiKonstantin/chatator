import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

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
				<div className='center-text' onClick={originalSwitch}>
					{/* <button className='header-button' onClick={originalSwitch}> */}
					<div className='center-text'>
						<FaChevronDown />
					</div>
					{/* </button> */}
					<div className='left-text'>{renderOriginal()}</div>
				</div>
			);
		} else {
			return '';
		}
	};
	return (
		<div className={`message-div-${message.messageType}`}>
			<div className='message-author'>{message.messageUser}</div>
			<div className={`message-bubble-${message.messageType}`}>
				{message.message}
				{renderOriginalButton()}
			</div>
			<br />
		</div>
	);
}
