import React, {useState, useEffect} from 'react'
import InfoBar from './InfoBar'
import {useList, useListDispatch} from './ParcelListContext';
import PictureCard from './PictureCard';

const InfoCard = (props) => {

	// get parcelList from context
	let parcelList = useList();

	// initialize the dispatcher for parcelList
	const listDispatch = useListDispatch();

	//let selectedParcel;
	let selectedParcel;

	let parcelsInView;

	// if parcelList is done loading grab parcel that has isSelectedParcel set to true. Should only be 1 in the array, so return first position element.
	if (typeof parcelList != 'undefined') {
		selectedParcel = parcelList.filter((item) => item.Client.isSelectedParcel)[0];
		console.log(parcelList.filter((item) => item.Client.inMapViewBounds));
		parcelsInView = parcelList.filter((item) => item.Client.inMapViewBounds);
		parcelsInView = parcelsInView.map((parcel) => {
			return <ParcelCard parcel={parcel}/>
		});
	}



	let parcel = [];

	let infoLink;

	let title = <h3> Select a Marker </h3>;

	// filter button was pressed, pass up the trigger to show the filter modal
	const filterButtonPressed = () => {
		props.filterButtonPressed();
	}


// loop through parcel object, create an InfoBar with each header:values from the parcel object
// only loop through the selected parcel if it exists
if(selectedParcel != [] && selectedParcel != null && typeof selectedParcel != 'undefined') {
	for (const [header, entries] of Object.entries(selectedParcel)) {
		// ignore certain headers
		if(header != 'location' && header != 'Location' && header != 'Client' && header != 'Pictures') {
			parcel.push(<InfoBar header={header} entries={entries} />)
		}
	}
	// change title to show that a property has been selected
	title = <h2> Selected Property </h2>;
}

const closeSelectedParcel = () => {
	console.log('closing selected parcel');
	listDispatch({
		type:'resetSelectedParcel'
	})
}

	
	return (
		<div className='InfoCard'>
				<div className='InfoCardHeader'>
					{title}
						{!selectedParcel &&
							<button className='button-17'
								onClick={props.filterButtonPressed}
								> 
								Filters 
							</button>
						}
						{selectedParcel && 
							<button className='button-17'
							onClick={closeSelectedParcel}
							>
							Close 
							</button>
						}
				</div>
			{selectedParcel && <PictureCard selectedParcel={selectedParcel}/>}
			{parcel}
			{parcelsInView && parcelsInView}
		</div>
		)
	
}

export default InfoCard;

const ParcelCard = (props) => {
	return (
		<div className='parcelCard'>
		<p> {props.parcel.Basic.PARCEL_NUM} </p>
		</div>
	)
}