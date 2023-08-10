
import React, {useState, useEffect} from 'react'
import MyMap from '../MyMap.js'
import HeaderBar from '../HeaderBar.js'
import InfoCard from '../InfoCard.js'
import Filters from '../Filters.js'
import io from 'socket.io-client';
import GetData from '../GetData'
import LoginCard from '../LoginCard'

function Home() {

const [showFilters, setShowFilters] = useState(false);
const [filtersClass, setFilterClass] = useState('FiltersHide');

const [newUserRegistered, setNewUserRegistered] = useState(false);
const [socket, setSocket] = useState();
const [googleMapsAPIKey, setGoogleMapsAPIKey] = useState();

// establish socket port if we haven't done it already
useEffect(() =>  {

	// only establish socket port if we haven't done it already
	if (!newUserRegistered){
		// establish socket port
		setSocket(io());
		setNewUserRegistered(true);
	}

	// only if socket is already established do we setup the message reciever
	if (socket) {
		// Process socket messages from server.
		// returns api key for google map
		socket.on('message', (res) => {
		  //console.log(res);
		  handleSocketMessage(res);
		})
	}

}, [socket])

	const handleSocketMessage = (res) => {
		if(res.googleMapsAPIKey) {
			setGoogleMapsAPIKey(res.googleMapsAPIKey);
			console.log('setting google maps api key');
		}
	}

	// either the filter button was pressed, or the 'X' close filters button was pressed, toggle the state.
	const filterButtonPressed = () => {
		console.log(showFilters);
		console.log(filtersClass);

		if (showFilters) {
			setShowFilters(false);
			setFilterClass('FiltersHide');
		} else {
			setShowFilters(true);
			setFilterClass('FiltersShow');
		}
	}


  return (
    	<React.Fragment>
	    	<GetData/>
	    	<LoginCard/>
			    <HeaderBar/>
			    {googleMapsAPIKey && (
			    		<div className="mapCard">
				    		<MyMap googleMapsAPIKey={googleMapsAPIKey} filtersClass={filtersClass}/>
						    <InfoCard filterButtonPressed={filterButtonPressed}/>
						    <Filters className={filtersClass} filterButtonPressed={filterButtonPressed}/>
				    	</div>
				    	)}
	    </React.Fragment>
  )
}

export default Home;