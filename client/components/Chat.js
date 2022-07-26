import React, { useState } from 'react';
// import { clientSocket } from '../clientSocket';
import { TiArrowUpThick } from 'react-icons/ti';
import { FaVolumeDown } from 'react-icons/fa';
import { FaVolumeMute } from 'react-icons/fa';
import { TbCopy } from 'react-icons/tb';
import { BsPersonFill } from 'react-icons/bs';
import Message from './Message';
import { clientSocket } from '../clientSocket';
import { useSelector, useDispatch } from 'react-redux';
import {
	addNewMessage,
	postMessage,
	setSelf,
	toggleSound,
	translateMessage,
} from '../store';
import { languages } from '../support/langList';
import UsersList from './UsersList';
import { playSound } from '../support/playSound';

export default function Chat() {
	const dispatch = useDispatch();
	const [values, setValues] = useState({
		joinUserLang: 'en',
		newUserLang: 'en',
	});
	const [{ newMessage }, setMessage] = useState({});
	const messages = useSelector((state) => state.messages);
	const self = useSelector((state) => state.self);
	const users = useSelector((state) => state.users);
	const typingStatus = useSelector((state) => state.typingStatus);
	const sound = useSelector((state) => state.sound);

	//Handling form input
	const handleChange = (event) => {
		event.persist();
		setValues((state) => ({
			...state,
			[event.target.name]: event.target.value,
		}));
	};

	//Handling message typing
	const handleTypingMessage = (event) => {
		event.persist();
		clientSocket.emit('typing-message', {
			userName: self.userName,
			userRoom: self.userRoom,
		});
		setMessage(() => ({
			newMessage: event.target.value,
		}));
	};

	//supporting functions:
	const handleCreateRoom = function (event) {
		event.preventDefault();
		const randomUserId = Math.floor(Math.random() * 100000);
		const randomRoomCode = Math.floor(Math.random() * 100000).toString();
		const [langName] = languages.filter(
			(lang) => lang.code === values.newUserLang
		);
		const selfInfo = {
			userId: randomUserId,
			isInRoom: true,
			userName: values.newUserName,
			userRoom: randomRoomCode,
			userLang: values.newUserLang,
			userLangName: langName.name,
		};
		dispatch(setSelf(selfInfo));
		clientSocket.emit('join-room', selfInfo);
		playSound('welcome');
	};

	const handleJoinRoom = function (event) {
		event.preventDefault();
		clientSocket.emit('check-room', values.joinUserRoom);
		//check if roomCode exists
		//if not give an error
		//if roomCode exists then join the room
		//joining room is basically setSelf and emit event to join room
		clientSocket.on('check-room-response', (response) => {
			if (response === 1) {
				const randomUserId = Math.floor(Math.random() * 100000);
				const [langName] = languages.filter(
					(lang) => lang.code === values.joinUserLang
				);
				const selfInfo = {
					userId: randomUserId,
					isInRoom: true,
					userName: values.joinUserName,
					userRoom: values.joinUserRoom,
					userLang: values.joinUserLang,
					userLangName: langName.name,
				};
				dispatch(setSelf(selfInfo));
				clientSocket.emit('join-room', selfInfo);
				playSound('welcome');
			} else {
				alert('Sorry, there is no such room...');
			}
		});
	};

	const handleSendMessage = async function (message, event) {
		event.preventDefault();

		if (message === '' || message === undefined) {
			console.log('Cannot send an empty message, sorry.');
		} else {
			const newMessage = {
				message: message,
				messageLang: self.userLang,
				messageRoom: self.userRoom,
				messageUser: self.userName,
				messageType: 'self',
			};
			await dispatch(postMessage(newMessage));
			if (users.length < 2) {
				const emptyRoomMessage = {
					message: `You are messaging to an empty room...`,
					messageLang: 'en',
					messageRoom: self.userRoom,
					messageUser: '',
					messageType: 'admin',
					adminMessageSubject: '',
				};
				await dispatch(translateMessage(emptyRoomMessage));
				// console.log('NOONE ELSE IN THIS ROOM!');
			}
			await setMessage({});
			// const scrollHeight = document.body.scrollHeight;
			// window.scroll({
			// 	top: scrollHeight,
			// 	behavior: 'smooth',
			// });
			// console.log('SCROLL HEIGHT: ', scrollHeight);
		}
	};

	const renderMessages = function (messages) {
		if (messages === undefined || messages.length === 0) {
			return '...';
		} else {
			return messages.map((message) => <Message message={message} />);
		}
	};

	const renderUsers = function (users) {
		if (users === undefined || users.length === 0) {
			return '~~~';
		} else {
			return users.map((user) => <UsersList user={user} />);
		}
	};

	const renderUserCount = function (users) {
		if (users === undefined) {
			return '-';
		} else {
			return users.length;
		}
	};
	const copyCode = function () {
		navigator.clipboard.writeText(self.userRoom);
		alert('Copied room code!');
	};
	//need to update the link - modularize
	const copyLink = function () {
		navigator.clipboard.writeText(
			`http://www.chatator.com/join/${self.userRoom}`
		);
		alert('Link to this room copied to clipboard!');
	};

	const rednerTypingStatus = function () {
		if (typingStatus.typing === undefined || typingStatus.typing === false) {
			return '...';
		} else {
			return `⌨️ ${typingStatus.userName} is typing...`;
		}
	};

	const toggleSoundButton = function () {
		dispatch(toggleSound());
	};

	const renderSoundButton = function () {
		if (sound) {
			return <FaVolumeDown />;
		} else {
			return <FaVolumeMute />;
		}
	};

	const renderSendButton = function (message) {
		if (message === '' || message === undefined) {
			return (
				<button className='message-button-inactive' type='submit'>
					{' '}
					<TiArrowUpThick />{' '}
				</button>
			);
		} else {
			return (
				<button className='message-button-active' type='submit'>
					{' '}
					<TiArrowUpThick />{' '}
				</button>
			);
		}
	};

	function toArray(collection) {
		return Array.prototype.slice.call(collection);
	}

	function noScroll(event) {
		if (event.type === 'focus') {
			document.body.classList.add('no-scroll');
		} else if (event.type === 'blur') {
			document.body.classList.remove('no-scroll');
		}
	}

	var inputs = toArray(document.querySelectorAll('input'));

	inputs.forEach(function (input) {
		input.addEventListener('focus', noScroll, false);
		input.addEventListener('blur', noScroll, false);
	});

	function scrollToBottom() {
		const scrollHeight = document.body.scrollHeight;
		window.scroll({
			top: scrollHeight,
			behavior: 'smooth',
		});
	}

	return (
		// Actual chat room:
		<div id='rooms-wrapper'>
			{self.isInRoom ? (
				//CHAT ROOM BELOW

				<div>
					<div id='chat-room'>
						<div id='chat-room-header'>
							<div className='header-buttons-div'>
								<div className='border-div'>
									<BsPersonFill /> {renderUserCount(users)}
								</div>
								<div className='border-div'>
									<button className='header-button' onClick={toggleSoundButton}>
										{renderSoundButton()}
									</button>
								</div>
							</div>
							<div className='header-buttons-div'>
								<div className='border-div'># {self.userRoom}</div>

								<button className='header-button' onClick={copyLink}>
									<TbCopy />
								</button>
							</div>
						</div>
						{/* <div id='chat-room-info'>
							<div>
								<ul className='users-wrapper'>{renderUsers(users)}</ul>
							</div>
						</div> */}
						<div id='chat'>
							<div id='messages-wrapper'>
								{renderMessages(messages)}
								<div id='typing-status'>{rednerTypingStatus()}</div>
							</div>
							<div id='message-input'>
								<form
									onSubmit={(event) => handleSendMessage(newMessage, event)}
									id='message-input-form'
									autoComplete='off'
								>
									<input
										type='text'
										id='message-entry'
										name='newMessage'
										value={newMessage || ''}
										onChange={handleTypingMessage}
										placeholder='Message here'
									/>
									{renderSendButton(newMessage)}
								</form>
							</div>
						</div>
					</div>
					{scrollToBottom()}
				</div>
			) : (
				//CHAT ROOM ABOVE
				// Create-Room and Join-Room forms
				<div id='waiting-room'>
					<div className='waiting-room-headline'>🥔 CREATE NEW ROOM</div>
					<form
						className='form'
						onSubmit={handleCreateRoom}
						key='create-room-form'
						autoComplete='off'
					>
						<input
							type='text'
							name='newUserName'
							onChange={handleChange}
							value={values.newUserName || ''}
							placeholder='Your Name'
						/>
						<select
							name='newUserLang'
							onChange={handleChange}
							value={values.newUserLang || ''}
							placeholder='Language'
						>
							{languages.map((language) => (
								<option value={language.code} key={`lang_${language.code}`}>
									{language.name}
								</option>
							))}
						</select>
						<button className='submit-button' type='submit'>
							Create Room
						</button>
					</form>
					<div className='waiting-room-headline'>or</div>
					<div className='waiting-room-headline'>🥔+🥔 JOIN EXISTING ROOM</div>
					<form
						className='form'
						onSubmit={handleJoinRoom}
						key='join-form'
						autoComplete='off'
					>
						<input
							name='joinUserRoom'
							onChange={handleChange}
							value={values.joinUserRoom || ''}
							placeholder='Room Code'
						/>
						<input
							type='text'
							name='joinUserName'
							onChange={handleChange}
							value={values.joinUserName || ''}
							placeholder='Your Name'
						/>
						<select
							name='joinUserLang'
							onChange={handleChange}
							value={values.joinUserLang || ''}
						>
							{languages.map((language) => (
								<option value={language.code} key={`lang_${language.code}`}>
									{language.name}
								</option>
							))}
						</select>
						<button className='submit-button' type='submit'>
							Join Room
						</button>
					</form>
				</div>
			)}
		</div>
	);
}
