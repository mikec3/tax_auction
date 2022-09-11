// source: https://medium.com/@allynak/how-to-use-google-map-api-in-react-app-edb59f64ac9d
// npm install @react-google-maps/api

import logo from './logo.svg';
import './App.css';
import {GoogleMap, LoadScript, Marker, InfoWindow} from '@react-google-maps/api'
import React, {useState, useEffect} from 'react'
import MapCard from './MapCard.js'
import MyMap from './MyMap.js'
import GetData from './GetData.js'
import HeaderBar from './HeaderBar.js'
import InfoCard from './InfoCard.js'
import io from 'socket.io-client';

function App() {

const [newUserRegistered, setNewUserRegistered] = useState(false);
const [socket, setSocket] = useState();
const [googleMapsAPIKey, setGoogleMapsAPIKey] = useState();

// establish socket port if we haven't done it already
useEffect(()=> {

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


	const [parcelList, setParcelList] = useState([]);
	const [selectedParcel, setSelectedParcel] = useState();

	const handleSocketMessage = (res) => {
		if(res.googleMapsAPIKey) {
			setGoogleMapsAPIKey(res.googleMapsAPIKey);
		}
	}

	// recieve the parce list from getData, this will be passed into the map component
	const floatParcelListUp = (passedUpList) => {
		setParcelList(passedUpList);
		
	}

	// receive the selected parcel from the map and set it to selectedParcel
	// this will be passed down into the info card
	const floatSelectedParcelUp = (passedUpParcelItem) => {
		setSelectedParcel(passedUpParcelItem);
	}


  return (
    <div className="App">
    <HeaderBar/>
    <MapCard>
    	<GetData floatParcelListUp={floatParcelListUp}/>
    	<MyMap googleMapsAPIKey={googleMapsAPIKey} data={parcelList} floatSelectedParcelUp={floatSelectedParcelUp}/>
    	<InfoCard parcel={selectedParcel}/>
    </MapCard>
    	
    </div>
  );
    }

export default App;
