import React, {useState, useEffect} from 'react'
import {GoogleMap, useJsApiLoader, Marker, InfoWindow, LoadScript, MarkerClusterer, ScriptLoaded} from '@react-google-maps/api';

//TODO fix MarkerClusterer Icon Image
//TODO format Marker Icon Text to be rounded TAXABLE_TOTAL to the $M or $K
// The component is re-rendering when we call props.floatSelectedParcelUp(item);
const MyMap = props => {

	console.log('MyMap rendered');

const [selected, setSelected] = useState({});
const [mapRender, setMapRender] = useState();
const [markers, setMarkers] = useState();

// when parcel Marker is selected, send the parcel up to app.js, so that app.js can send the selected parcel down to the info window
const onSelect = item => {
	setSelected(item);
	props.floatSelectedParcelUp(item);
}

// map styling
const containerStyle = {
  width: '50vw',
  height: '90vh'
};

// center the map over the selected parcel if present, otherwise center over King County
let center = {};
if (selected.location) {
	center = selected.location;
} else {
  center = {
	  lat: 47.608,
	  lng: -122.087
	};
}

// MarkerClusterer options
const options = {
	minimumClusterSize: 10,
  //	imagePath:
  //  '/clusterer/m' // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
}

// filter out parcels that don't have a lat/long
let filteredList = props.data.filter(item => item.location.lat != null);

// display map with Markers and MarkerClusterer
return (
	<div>
		<LoadScript googleMapsApiKey = {props.googleMapsAPIKey}>
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={center}
				zoom={7}
				>
				 		<MarkerClusterer options={options}>
	 		{(clusterer) =>
	 			filteredList.map((parcel) => (
	 				<Marker key={parcel.Basic.PARCEL_NUM}
		 				position={parcel.location}
		 				label={{
		 					text: parcel.Tax.TAXABLE_TOTAL,
		 					color: 'white'
		 				}}
		 				icon={{
		 					url: '/test_marker.png'
		 				}}
		 				onClick={()=> onSelect(parcel)}
		 				clusterer={clusterer}
	 				/>
	 				))
	 		}
 		</MarkerClusterer>
			</GoogleMap>
		</LoadScript>
	</div>
)
}

export default MyMap;

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