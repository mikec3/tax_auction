import React, {useState, useEffect, useRef} from 'react'
import {GoogleMap, useGoogleMap, useJsApiLoader, Marker, InfoWindow, LoadScript, MarkerClusterer, ScriptLoaded} from '@react-google-maps/api';
import {useList, useListDispatch} from './ParcelListContext';

// TODO need to configure webpack file loader to import images in this way. Currently importing directly in script via relative path.
//import markerImage from './test_marker.png';
//import selectedMarkerImage from './selected_marker.png'


// The component is re-rendering when we call props.floatSelectedParcelUp(item);
const MyMap = props => {

// initialize the dispatcher for parcelList
const listDispatch = useListDispatch();

const [selected, setSelected] = useState();
const [mapRender, setMapRender] = useState();
const [markers, setMarkers] = useState();

const [center, setCenter] = useState({
	  lat: 47.608,
	  lng: -122.087
	});

// save the last map view bounds to cut down on map Idle sends to the parcel list context
const [mapViewBounds, setMapViewBounds] = useState(0);

// get parcel list from useList() context hook.
const parcelList = useList();
console.log(parcelList);

// when parcel Marker is selected, send the parcel up to app.js, so that app.js can send the selected parcel down to the info window
const onParcelSelected = item => {
	setSelected(item);
	//add selected parcel to context
	listDispatch({
		type: 'setSelected',
		parcelNum: item.Basic.PARCEL_NUM
	})
}

// map styling - make responsive according to window, width-height need to be set in absolute terms (can't take %).
let containerStyle = {};

if (window.innerWidth <= 500) {
	containerStyle = {
	  width: '100vw',
	  height: '50vh'
	};
} else {
	containerStyle = {
		width: '50vw',
		height: '90vh'
	}
}

// center the map over the selected parcel if present, otherwise center over King County
// took out because it cause an infinite loop
// if (selected) {
// 	setCenter(selected.location);
// }


// MarkerClusterer options
const options = {
	minimumClusterSize: 10,
  //	imagePath:
  //  '/clusterer/m' // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
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

const [mapRef, setMapRef] = useState(null);

const MapHasLoaded = (map) => {
	setMapRef(map);
}

// get map bounds.
const handleMapIdle = () => {

	//console.log(mapRef.getBounds().getNorthEast().lat());
	//console.log(mapRef.getBounds().getNorthEast().lon());

	// check if map view bounds are different than last time
	const N = mapRef.getBounds().getNorthEast().lat();
	const S = mapRef.getBounds().getSouthWest().lat();
	const W = mapRef.getBounds().getSouthWest().lng();
	const E = mapRef.getBounds().getNorthEast().lng();

	setCenter(mapRef.getCenter());
	console.log(center);

	console.log([N, S, W, E])
	console.log(mapViewBounds);

	if (mapViewBounds != N) {
		console.log('sending to list dispatch');
		// send coordinates to context so that parcels in map view bounds can be marked
		listDispatch({
			type: 'setParcelsInMapViewBounds',
			N: N,
			S: S,
			W: W,
			E: E
		})

		// set the mapViewBounds so we can check again next time idle is called
		setMapViewBounds(N)
	}


}

// display map with Markers and MarkerClusterer
// conditionally render map if parcels have been loaded and parcelList is no longer undefined or in loading state.
if (typeof parcelList != 'undefined') {
	return (
		<div>
			<LoadScript googleMapsApiKey = {props.googleMapsAPIKey}>
				<GoogleMap
					onLoad={MapHasLoaded}
					mapContainerStyle={containerStyle}
					center={center}
					zoom={7}
					options={{ gestureHandling: 'greedy' }}
					onIdle={handleMapIdle}
					>
				 		<MarkerClusterer options={options}>
				 		{(clusterer) =>
				 			// filter out parcels without a latitude
				 			parcelList.filter(item => item.location.lat != null)
				 			.map((parcel) => {
				 				let iconURL = './test_marker.png';
				 				// check to see if this parcel is the active selected parcel,
				 				// change marker image if it's the active selected parcel
					 			if (parcel.Client.isSelectedParcel || parcel.Client.isHighlightedParcel) {
					 					iconURL = '/selected_marker.png';
					 			}
				 				
				 				// build marker object
				 				return (
				 				<Marker 
				 					key={parcel.Basic.PARCEL_NUM}
					 				position={parcel.location}
					 				label={{
					 					text: formatNumber(parcel.Tax.TAXABLE_TOTAL),
					 					color: 'white',
					 					fontWeight: 'bold',
					 					fontSize: '12px',
					 					className: 'markerLabels'		// CSS properties are set in App.css (margin so that label lines up with icon image)
					 				}}
					 				icon={{
					 					url: iconURL
					 				}}
					 				onClick={()=> onParcelSelected(parcel)}
					 				clusterer={clusterer}
				 				/>
				 				)})
				 		}
 					</MarkerClusterer>
				</GoogleMap>
			</LoadScript>
		</div>
		)
} else {
	return (
			<div>
				<p> Loading Parcels... </p>
			</div>
		)
	}
}

export default MyMap;

		// <LoadScript googleMapsApiKey = {props.googleMapsAPIKey}>
		// 	<GoogleMap
		// 		mapContainerStyle={containerStyle}
		// 		center={center}
		// 		zoom={7}
		// 		options={{ gestureHandling: 'greedy' }}
		// 		>
		// 		 		<MarkerClusterer options={options}>
	 // 		{(clusterer) =>
	 // 			filteredList.map((parcel) => {
	 // 				let iconURL = './test_marker.png';
	 // 				// check to see if this parcel is the active selected parcel,
	 // 				// change marker image if it's the active selected parcel
	 // 				if (selected) {
		//  				if (parcel.Basic.PARCEL_NUM == selected.Basic.PARCEL_NUM) {
		//  					iconURL = '/selected_marker.png';
		//  				}
	 // 				}
	 // 				// build marker object
	 // 				return (
	 // 				<Marker key={parcel.Basic.PARCEL_NUM}
		//  				position={parcel.location}
		//  				label={{
		//  					text: formatNumber(parcel.Tax.TAXABLE_TOTAL),
		//  					color: 'white',
		//  					fontWeight: 'bold',
		//  					fontSize: '12px',
		//  					className: 'markerLabels'		// CSS properties are set in App.css (margin so that label lines up with icon image)
		//  				}}
		//  				icon={{
		//  					url: iconURL
		//  				}}
		//  				onClick={()=> onSelect(parcel)}
		//  				clusterer={clusterer}
	 // 				/>
	 // 				)})
	 // 		}
 	// 	</MarkerClusterer>
		// 	</GoogleMap>
		// </LoadScript>




				// {selected.location && (
				// 	<InfoWindow
				// 	position={selected.location}
				// 	clickable={true}
				// 	onCloseClick={() => setSelected({})}
				// 	>
				// 	<div>
				// 		<p>{selected.Basic.PARCEL_NUM}</p>
				// 		<p>{selected.Tax.TAXABLE_TOTAL}</p>
				// 	</div>
				// 	</InfoWindow>
					// )
				// }