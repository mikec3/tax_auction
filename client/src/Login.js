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


	// use this if you want to let email/password signups.
	const loginForm = (
				<div>
					<form onSubmit={loginFormSubmitHandler}>
						<input type='text' id='email' placeholder='E-mail'/>
						<input type='text' id='password' placeholder='Password'/>
						<button type="Submit"> Login </button>
					</form>
				</div>
		)



return (
			<div>
				<div>
				<img className='LoginButton' onClick={loginWithgoogle} src={"./blank_avatar.png"} />
				</div>
			</div>
		)
}

export default Login;