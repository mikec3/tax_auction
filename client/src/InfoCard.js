import React, {useState, useEffect} from 'react'
import InfoBar from './InfoBar'

const InfoCard = (props) => {

	let parcel = [];

	let infoLink;
	let picture;

	let title = <h2> Select a Marker </h2>;

	// filter button was pressed, pass up the trigger to show the filter modal
	const filterButtonPressed = () => {
		props.filterButtonPressed();
	}


// loop through parcel object, create an InfoBar with each header:values from the parcel object
if(props.parcel != null) {
	for (const [header, entries] of Object.entries(props.parcel)) {
		// ignore location headers
		if(header != 'location' && header != 'Location') {
			parcel.push(<InfoBar header={header} entries={entries} />)
		}
	}

	// if there is a property picture, show it, otherwise show missing picture icon
	if (props.parcel.Building.PROPERTY_PICTURE){
		picture = <img className={'parcelImage'} src={props.parcel.Building.PROPERTY_PICTURE} />;
	} else {
		picture = <img className={'parcelImage'} src={'./missing_icon.png'} />;
	}
	// change title to show that a property has been selected
	title = <h2> Selected Property </h2>;
}

	
	return (
		<div className='InfoCard'>
				<div className='InfoCardHeader'>
					{title}
						<button className='filterMenuButton'
							onClick={props.filterButtonPressed}
							> 
							Filters 
						</button>
				</div>
			{picture}
			{parcel}
		</div>
		)
	
}

export default InfoCard;