import React, {useState, useEffect} from 'react'

const InfoCard = (props) => {

	let parcel = [];

	const headerStyle = {
		margin: 'auto'
	}

// loop through the parcel object
if(props.parcel != null) {
	
	for (const [key, value] of Object.entries(props.parcel)) {
		if (key != 'location'){
    		//console.log(`${key}: ${value}`);
   			parcel.push(<p>{key} : {value} </p>)
   		}
	}
}
	
	return (
		<div>
		<h3 style={headerStyle}> Selected Property </h3>
		{parcel}
		</div>
		)
	
}

export default InfoCard;