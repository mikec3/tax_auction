import React from 'react'
import {signInWithGoogle, logInWithEmailAndPassword, AuthStateChanged} from './firebase'
import {useUserDispatch} from './UserContext'


function Login (props) {


  const userDispatch = useUserDispatch();


	const loginFormSubmitHandler = (event) => {
		event.preventDefault();
		logInWithEmailAndPassword(event.target.email.value, event.target.password.value)
	}

	const loginWithgoogle = () => {
		signInWithGoogle()
	}

console.log('login.js');

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
			<div className='Login'>
				<button className='button-17' onClick={loginWithgoogle}> Log In </button>
			</div>
		)
}

export default Login;