import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {logout, UpdateDisplayName, AuthStateChanged} from './firebase'
import {useUser, useUserDispatch} from './UserContext'


function LoggedIn(props) {
	console.log('loggedin.js');

	const [userTheme, setUserTheme] = useState();

	// triggers firebase.js to check for a logged in user, will send user to UserContext if present
	//AuthStateChanged();

	// run everytime the user prop changes
	// useEffect(()=> {
	// 	// get current user's theme only if user present
	// 	if(props.user.accessToken){
	// 		getUserTheme();
	// 	}
	// }, [props.user])

	// const getUserTheme = async () => {
	// 	//console.log(props.user);
	// 	let data = JSON.stringify({
	// 		"user": props.user,
	// 	})

	// 	let config = {
	// 		method : 'post',
	// 		url: '/api/getUserTheme',
	// 		headers: {
	// 			    'Content-Type': 'application/json', 
 //    				'Accept': 'application/json'
	// 		},
	// 		data : data
	// 	};

	// 	axios(config)
	// 	.then((response) => {
	// 		//console.log(JSON.stringify(response))
	// 		if (response != 'error') {
	// 		// if user theme update is successful, set the theme here.
	// 		setUserTheme(response.data);
	// 		} else {
	// 		//setError('theme not found')
	// 		}
	// 	})
	// 	.catch((error) => {
 //  		console.log(error);
	// 	});
	// }

	const handleLogOutButtonPress = async () => {
		logout();
	}

	const nameChangeFormSubmit = async (event) => {
		event.preventDefault();

		let currUser = await UpdateDisplayName(event.target.name.value);
		props.passUpUser(currUser);
	}

	const updateUserThemeHandler = async (event) => {
		event.preventDefault();

		let data = JSON.stringify({
			"user": props.user,
			"theme": event.target.theme.value
		})

		let config = {
			method : 'post',
			url: '/api/updateUserTheme',
			headers: {
				    'Content-Type': 'application/json', 
    				'Accept': 'application/json'
			},
			data : data
		};

		axios(config)
		.then((response) => {
			if (response != 'error') {
			// if user theme update is successful, set the theme here.
			setUserTheme(event.target.theme.value);
			} else {
			//setError('theme not found')
			}
		})
		.catch((error) => {
  		console.log(error);
		});
	}

return (
			<div className='LoggedIn'>
				<button className='button-17' onClick={handleLogOutButtonPress}> Log Out </button>
			</div>
		)
}

export default LoggedIn;


				// <p> Welcome {props.user.displayName} </p>
				// <h3> Your theme is {userTheme} </h3>
				// 	<form onSubmit={nameChangeFormSubmit}>
				// 		<input type='text' id='name' placeholder='New Display Name'/>
				// 		<button type="Submit"> Change Display Name </button>
				// 	</form>
				// 	<form onSubmit={updateUserThemeHandler}>
				// 		<input type='text' id='theme' placeholder='New Theme'/>
				// 		<button type="Submit"> Change Theme </button>
				// 	</form>




