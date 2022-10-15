import React from 'react';

export default function UsersList(props) {
	return (
		<li>
			{props.user.userName} - {props.user.userLang}
		</li>
	);
}
