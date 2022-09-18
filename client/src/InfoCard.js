import React, {useState, useEffect} from 'react'

const InfoCard = (props) => {

	let parcel = [];

	const headerStyle = {
		margin: 'auto'
	}

// loop through the parcel object
if(props.parcel != null) {
	
	for (const [group, entries] of Object.entries(props.parcel)) {
		if (group != 'location' || group != 'Location'){
    		//console.log(`${key}: ${value}`);
   			//parcel.push(<p>{key} : {value} </p>)
   			parcel.push(<h3>{group}</h3>);
   			for (const [key, value] of Object.entries(entries)) {
   				parcel.push(<p>{key}: {value}</p>);
   			}
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