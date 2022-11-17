import React, {useState, useEffect} from 'react'
import {GoogleMap, useJsApiLoader, Marker, InfoWindow, LoadScript} from '@react-google-maps/api';

// TODO center map on selected parcel is selected parcel is not null
// TODO stop map from re-rendering after info box has been closed
const MyMap = props => {

	console.log('MyMap rendered');

const [selected, setSelected] = useState({});
const [mapRender, setMapRender] = useState();
const [markers, setMarkers] = useState();

const onSelect = item => {
	setSelected(item);
	props.floatSelectedParcelUp(item);
}



// set the google maps api key if we haven't done it yet
useEffect(()=>{
console.log('MyMap useEffect called');
	if (props.data) {

	// filter out properties that don't have a valid latitude.
	let filteredList = props.data.filter(item => item.location.lat != null);

	//filteredList = props.data.filter(item => item.Basic.PARCEL_NUM == '00373301100301')

	const markers = filteredList.map(item=> {

  	return(
  		<Marker
  		key={item.Basic.PARCEL_NUM}
  		label={{
  			text: item.Tax.TAXABLE_TOTAL,
  			color: 'white'
  		}}
  		icon = {{url: '/test_marker.png',
                 scale: 500
  	    }}
  		position={item.location}
  		onMouseOver={() => onSelect(item)}
  		/>)
  		
  })

	setMarkers(markers);
}
},[props.data])

// went with the LoadScript wrapper becase this was giving a typeError...
// const {isLoaded} = useJsApiLoader({
// 	id: 'google-map-script',
// 	//googleMapsApiKey: apikeyyyyy
// })

const [map, setMap] = useState(null);

const onLoad = React.useCallback(function callback(map) {
	//const bounds = new window.google.maps.LatLngBounds(center);
	//map.fitBounds(bounds);
	setMap(map)
}, [])

const onUnmount = React.useCallback(function callback(map){
	setMap(null)
}, [])
	
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


// const center = {
//   lat: 47.608,
//   lng: -122.087
// };


return (
	<div>
		<LoadScript googleMapsApiKey = {props.googleMapsAPIKey}>
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={center}
				zoom={7}
				onLoad={onLoad}
				onUnmount={onUnmount}
				>
				{markers}
				{selected.location && (
					<InfoWindow
					position={selected.location}
					clickable={true}
					onCloseClick={() => setSelected({})}
					>
					<div>
						<p>{selected.Basic.PARCEL_NUM}</p>
						<p>{selected.Tax.TAXABLE_TOTAL}</p>
					</div>
					</InfoWindow>
					)
				}
			</GoogleMap>
		</LoadScript>
	</div>
)
}

export default MyMap;