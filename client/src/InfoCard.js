import React, {useState, useEffect} from 'react'
import InfoBar from './InfoBar'

const InfoCard = (props) => {

	let parcel = [];

	let infoLink;
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
		if(header != 'location' && header != 'Location') {
			parcel.push(<InfoBar header={header} entries={entries} />)
		}
	}

	infoLink = <a href={props.parcel.Basic.PROPERTY_INFO_LINK} target='_blank'> Link to Details </a>
}

//console.log(props.parcel);

	
	return (
		<div className='InfoCard'>
		<h2> Selected Property </h2>
		{infoLink}
		{parcel}
		<p> TODO: </p>
		<p> add links </p>
		<p> Add pictures?? </p>
		<p> Make markers responsive to the selected parcel </p>
		<p> Filter parcels </p>
		<p> add details (auction date, etc...)</p>
		</div>
		)
	
}

export default InfoCard;