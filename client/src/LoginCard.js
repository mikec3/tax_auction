import React, {useEffect, useState} from 'react'
import axios from 'axios'
//import SignUp from './SignUp'
import Login from './Login'
import LoggedIn from './LoggedIn'
import {useUser} from './UserContext'


function LoginCard(props) {

		// current logged in user state
	const [user, setUser] = useState();

	const userCont = useUser();

	useEffect(()=>{
		setUser(userCont);

	}, [userCont])

	// receives the user during display name change
	// setting user using destructuring so that shallow equality check of react engine triggers re-render of componenets looking at user object
	const passUpUser = (user) => {
		if (!user){
			setUser(null);
		} else {
			setUser({...user});
		}
	}

return (
	<div className='LoginCard'>
		{user && 
			<LoggedIn user={user} passUpUser={passUpUser}/>
		}
		{!user &&
			<React.Fragment>
				<Login/>
			</React.Fragment>
		}
	</div>);
}

export default LoginCard;