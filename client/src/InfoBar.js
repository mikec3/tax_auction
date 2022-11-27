import React, {useState, useEffect} from 'react'

const InfoBar = (props) => {

	//const [mouseIn, setMouseIn] = useState(false);

	// delcare a flexOrder variable, set by the props.header passed in. This will determine the order of the infoBar's in the infoCard
	let flexOrder;

	switch (props.header){
		case "Basic":
			flexOrder = 1;
			break;
		case "Meta":
			flexOrder = 2;
			break;
		case "Building":
			flexOrder = 3;
			break;
		case "Land":
			flexOrder = 4;
			break;
		case "Tax":
			flexOrder = 5;
			break;
		default:
			flexOrder = 6;
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
		case "PROPERTY_PICTURE": 			// do nothing for property pictures
			break;
		case "PARCEL_DATA_BASE_URL": 		// ignore base url
			break;
		case "PARCEL_VIEWER_URL": 			// show parcel viewer link
			entries.push(<li><a href={value} target='_blank'> Parcel Mapping Site </a></li>);
			break;
		case "PARCEL_INFO_URL":
			entries.push(<li><a href={value} target='_blank'> County Foreclosed Parcel Information </a></li>);
			break;
		case "AUCTION_INFO_URL":
			entries.push(<li><a href={value} target='_blank'> County Foreclosure Information </a></li>);
			break;
		case "AUCTION_SITE":
			if (props.entries.AUCTION_SITE_FLAG == 'Online') {
				entries.push(<li>{key}: <a href={value} target='_blank'> {value} </a></li>);
			} else {
				entries.push(<li>{key}: {value}</li>);
			}
			break;
		case "AUCTION_SITE_FLAG": 			// ignore auction site AUCTION_SITE_FLAG
			break;
		default:
			entries.push(<li>{key}: {value}</li>);
			break;
		}
	}

	// set header
	let header;
	switch(props.header){
		case "Meta":
			header = "Auction Info";
			break;
		default:
			header = props.header;
			break;
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
			<h3> {header} </h3>
			<ul>
				{entries}
			</ul>
		</div>
	)
}

export default InfoBar;