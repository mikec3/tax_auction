// source: https://medium.com/@allynak/how-to-use-google-map-api-in-react-app-edb59f64ac9d
// npm install @react-google-maps/api

import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react'
import MyMap from './MyMap.js'
import HeaderBar from './HeaderBar.js'
import InfoCard from './InfoCard.js'
import Filters from './Filters.js'
import io from 'socket.io-client';
import {ParcelListProvider} from './ParcelListContext';
import GetData from './GetData'

function App() {

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
    <div className="App">
    	<ParcelListProvider>
    	<GetData/>
		    <HeaderBar/>
		    {googleMapsAPIKey && (
		    		<div className="mapCard">
			    		<MyMap googleMapsAPIKey={googleMapsAPIKey}/>
					    	<InfoCard filterButtonPressed={filterButtonPressed}/>
					    	<Filters className={filtersClass} filterButtonPressed={filterButtonPressed}/>
			    	</div>
			    	)}
	    </ParcelListProvider>
    </div>
  )
}

export default App;



