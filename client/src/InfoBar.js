import React, {useState, useEffect} from 'react'

const InfoBar = (props) => {

	//const [mouseIn, setMouseIn] = useState(false);

	// delcare a flexOrder variable, set by the props.header passed in. This will determine the order of the infoBar's in the infoCard
	let flexOrder;

	switch (props.header){
		case "Basic":
			flexOrder = 1;
			break;
		case "Building":
			flexOrder = 2;
			break;
		case "Land":
			flexOrder = 3;
			break;
		case "Tax":
			flexOrder = 4;
			break;
		default:
			flexOrder = 5;
			break;
	}

	// loop through entries
	const entries = [];

	for (const [key, value] of Object.entries(props.entries)) {

		// treat certain keys special, all else goes into list item of key: value
		switch (key) {
		case "PROPERTY_INFO_LINK": 			// create a link for the PROPERTY_INFO_LINK and add to the front of the array (unshift())
			entries.unshift(<li><a href={value} target='_blank'> County Parcel Page </a></li>);
			break;
		default:
			entries.push(<li>{key}: {value}</li>);
			break;
		}
	}

	// const handleMouseEnter = (e) => {
	// 	e.preventDefault();
	// 	console.log('mouse entered!');
	// 	setMouseIn(true);
	// }

	// const handleMouseLeave = (e) => {
	// 	e.preventDefault();
	// 	console.log('mouse left!');
	// 	setMouseIn(false);
	// }
	
	return (
		<div className='InfoBar'
		style={{order:flexOrder}}>
			<h3> {props.header} </h3>
			<ul>
				{entries}
			</ul>
		</div>
	)
}

export default InfoBar;