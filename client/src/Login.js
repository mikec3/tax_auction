import React from 'react'
import {signInWithGoogle, logInWithEmailAndPassword, AuthStateChanged} from './firebase'


function Login (props) {

	const loginFormSubmitHandler = (event) => {
		event.preventDefault();
		logInWithEmailAndPassword(event.target.email.value, event.target.password.value)
	}

	const loginWithgoogle = () => {
		signInWithGoogle()
	}

// triggers firebase.js to check for a logged in user, will send user to UserContext if present
AuthStateChanged();



return (
			<div>
				<div>
					<h2> Firebase Auth </h2>
					<form onSubmit={loginFormSubmitHandler}>
						<input type='text' id='email' placeholder='E-mail'/>
						<input type='text' id='password' placeholder='Password'/>
						<button type="Submit"> Login </button>
					</form>
				</div>
				<div>
					<button className='GoogleButton' onClick={loginWithgoogle}> Sign in with Google+ </button>
				</div>
			</div>
		)
}

export default Login;