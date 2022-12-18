import React, {useState, useEffect} from 'react'
import InfoBar from './InfoBar'
import {useList, useListDispatch} from './ParcelListContext';

const InfoCard = (props) => {

	// get parcelList from context
	let parcelList = useList();

	let selectedParcel;

	// if parcelList is done loading grab parcel that has isSelectedParcel set to true. Should only be 1 in the array, so return first position element.
	if (parcelList != 'Loading...' && typeof parcelList != 'undefined') {
		selectedParcel = parcelList.filter((item) => item.Client.isSelectedParcel)[0];
	}

	let parcel = [];

	let infoLink;
	let picture;

	let title = <h2> Select a Marker </h2>;

	// filter button was pressed, pass up the trigger to show the filter modal
	const filterButtonPressed = () => {
		props.filterButtonPressed();
	}


// loop through parcel object, create an InfoBar with each header:values from the parcel object
if(selectedParcel != [] && selectedParcel != null && typeof selectedParcel != 'undefined') {
	for (const [header, entries] of Object.entries(selectedParcel)) {
		// ignore location headers
		if(header != 'location' && header != 'Location' && header != 'Client') {
			parcel.push(<InfoBar header={header} entries={entries} />)
		}
	}

	// if there is a property picture, show it, otherwise show missing picture icon
	if (selectedParcel.Building.PROPERTY_PICTURE){
		picture = <img className={'parcelImage'} src={selectedParcel.Building.PROPERTY_PICTURE} />;
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