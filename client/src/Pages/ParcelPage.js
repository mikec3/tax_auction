import React, {useState, useEffect} from 'react'
import HeaderBar from '../HeaderBar.js'
import {useList, useListDispatch} from '../ParcelListContext';
import GetData from '../GetData'; // need to include this to initialize the parcel list context
import PictureCard from '../PictureCard';
import InfoBarCard from '../InfoBarCard';
import {GoogleMap, useGoogleMap, useJsApiLoader, Marker, InfoWindow, LoadScript, MarkerClusterer, ScriptLoaded} from '@react-google-maps/api';
import ParcelInfoHeader from '../ParcelInfoHeader'
import ScoreCard from '../ScoreCard'
import Description from '../Description'
import useNumberFormat from '../useNumberFormat'
import io from 'socket.io-client';
import AuctionBox from '../AuctionBox'


function ParcelPage() {

	//get parcel list from context
	let parcelList = useList();

	const [socket, setSocket] = useState();
	const [newUserRegistered, setNewUserRegistered] = useState(false);
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

	console.log(parcelList);

	let searchParam = new URLSearchParams(window.location.search);

	let searchParamParcelNum = searchParam.get('parcel');

	console.log(searchParamParcelNum);
	//console.log(searchParam.toString());

	let selectedParcel;

	let center = {
	  lat: 47.608,
	  lng: -122.087
	};

	if (typeof parcelList != 'undefined') {
		console.log(parcelList.filter(item=> item.Basic.PARCEL_NUM == searchParamParcelNum));
		selectedParcel = parcelList.filter(item=> item.Basic.PARCEL_NUM == searchParamParcelNum)[0];
		console.log(selectedParcel.location.lat);
		center = {
			lat: selectedParcel.location.lat,
			lng: selectedParcel.location.lng};
	}

	let	containerStyle = {
		width: '20vw',
		height: '15vh'
	}

		//format TAXABLE_TOTAL values (for instance 100,00 -> 100K)
const formatNumber = function (dollarFigure) {

	// convert from input dollarFigure to an integer
	//let numType = parseInt(dollarFigure.replace(/[^0-9]/g, ""));
	let numType = dollarFigure;

	// if number is over 1M
	if (numType >= 1000000) {

		// rounding to 1 decimal for millions
		let mill = numType/1000000
		mill = +mill.toFixed(1);
		return String(mill)+"M"

	// if number is less than 1M
	} else {
		// rounding to nearest integer for thousands
		return String(parseInt(numType/1000))+"K"
	}
}


  return (
    	<div className='ParcelPageWrapper'>
    			<GetData/>
			    <HeaderBar/>
			    {parcelList &&
			    	<React.Fragment>
			    		<div className="Modal"> Modal </div>
			    		<ParcelInfoHeader parcel={selectedParcel}/>
			    		<Description parcel={selectedParcel}/>
			    		<PictureCard selectedParcel={selectedParcel}/>
			    		<div className='ScoreCard-Card'>
			    			<div style={{"width" : "25%"}}> 
							<LoadScript googleMapsApiKey = {googleMapsAPIKey}>
								<GoogleMap
									mapContainerStyle={containerStyle}
									center={center}
									zoom={9}
									onClick={()=>{console.log('map clicked')}}
									options={{ gestureHandling: 'greedy' }}
									>
								 				<Marker 
								 					key={selectedParcel.Basic.PARCEL_NUM}
									 				position={selectedParcel.location}
									 				label={{
									 					text: formatNumber(selectedParcel.Tax.TAXABLE_TOTAL),
									 					color: 'white',
									 					fontWeight: 'bold',
									 					fontSize: '12px',
									 					className: 'markerLabels'		// CSS properties are set in App.css (margin so that label lines up with icon image)
									 				}}
									 				icon={{
									 					url: '/selected_marker.png'
									 				}}
								 				/>
								</GoogleMap>
							</LoadScript>
						</div>
			    			<ScoreCard parcel = {selectedParcel}/>
			    			<AuctionBox parcel = {selectedParcel}/>
			    		</div>
			    		<InfoBarCard selectedParcel={selectedParcel}/>
			    	</React.Fragment>
				}
	    </div>
  )
}

export default ParcelPage;