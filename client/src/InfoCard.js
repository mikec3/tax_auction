import React, {useState, useEffect} from 'react'
import InfoBar from './InfoBar'

const InfoCard = (props) => {

	let parcel = [];

	const headerStyle = {
		margin: 'auto'
	}

// // loop through the parcel object
// if(props.parcel != null) {
	
// 	for (const [group, entries] of Object.entries(props.parcel)) {
// 		if (group != 'location' || group != 'Location'){
//     		//console.log(`${key}: ${value}`);
//    			//parcel.push(<p>{key} : {value} </p>)
//    			parcel.push(<h3>{group}</h3>);
//    			for (const [key, value] of Object.entries(entries)) {
//    				parcel.push(<p>{key}: {value}</p>);
//    			}
//    		}
// 	}
// }

// loop through parcel object, create an InfoBar with each header:values from the parcel object
if(props.parcel != null) {
	for (const [header, entries] of Object.entries(props.parcel)) {
		// ignore location headers
		if(header != 'location' || header != 'Location') {
			parcel.push(<InfoBar header={header} entries={entries} />)
		}
	}
}
	
	return (
		<div className='InfoCard'>
		<h3 style={headerStyle}> Selected Property </h3>
		{parcel}
		</div>
		)
	
}

export default InfoCard;