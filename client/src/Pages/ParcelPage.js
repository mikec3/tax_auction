import React, {useState, useEffect} from 'react'
import HeaderBar from '../HeaderBar.js'
import {useList, useListDispatch} from '../ParcelListContext';
import GetData from '../GetData'; // need to include this to initialize the parcel list context
import PictureCard from '../PictureCard';
import InfoBarCard from '../InfoBarCard';
import {GoogleMap, useGoogleMap, useJsApiLoader, Marker, InfoWindow, LoadScript, MarkerClusterer, ScriptLoaded} from '@react-google-maps/api';
import ParcelInfoHeader from '../ParcelInfoHeader'
import ScoreCard from '../ScoreCard'
import useNumberFormat from '../useNumberFormat'


function ParcelPage() {

	//get parcel list from context
	let parcelList = useList();

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
		width: '100vw',
		height: '50vh'
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
			    		<ParcelInfoHeader parcel={selectedParcel}/>
			    		<p> {selectedParcel.Basic['Site Address']}</p>
			    		<PictureCard selectedParcel={selectedParcel}/>
			    		<ScoreCard parcel = {selectedParcel}/>
			    		<InfoBarCard selectedParcel={selectedParcel}/>
					    <div>
							<LoadScript >
								<GoogleMap
									mapContainerStyle={containerStyle}
									center={center}
									zoom={13}
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
			    	</React.Fragment>
				}
	    </div>
  )
}

export default ParcelPage;