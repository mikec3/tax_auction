import React, {useState, useEffect} from 'react'
import {GoogleMap, useJsApiLoader, Marker, InfoWindow, LoadScript} from '@react-google-maps/api';

const MyMap = props => {

const [selected, setSelected] = useState({});
const [googleMapsAPIKey, setGoogleMapsAPIKey] = useState();
const [mapRender, setMapRender] = useState();

const onSelect = item => {
	setSelected(item);
	props.floatSelectedParcelUp(item);
}

// set the google maps api key if we haven't done it yet
useEffect(()=>{
	if (!googleMapsAPIKey) {
		setGoogleMapsAPIKey(props.googleMapsAPIKey);
	}

	if (googleMapsAPIKey) {
	setMapRender(
		<LoadScript googleMapsApiKey = {googleMapsAPIKey}>
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={center}
				zoom={10}
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
						<p>{selected.PARCEL_NUM}</p>
						<p>{selected.TAXABLE_TOTAL}</p>
					</div>
					</InfoWindow>
					)
				}
			</GoogleMap>
		</LoadScript>
		)
}
},[props])

// went with the LoadScript wrapper becase this was giving a typeError...
// const {isLoaded} = useJsApiLoader({
// 	id: 'google-map-script',
// 	//googleMapsApiKey: 'AIzaSyB2U6f1qmwk4mce7ekmALZ9GQUbMKYzf7c'
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
  width: '800px',
  height: '600px'
};

const center = {
  lat: 47.608,
  lng: -122.087
};


const markers = props.data.map(item=> {
  	return(
  		<Marker
  		key={item.PARCEL_NUM}
  		position={item.location}
  		onMouseOver={() => onSelect(item)}
  		/>)
  })

console.log(googleMapsAPIKey);

return (
	<div>
	{mapRender && mapRender}
	</div>
)
}

export default MyMap;