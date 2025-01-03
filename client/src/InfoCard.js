import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import InfoBar from './InfoBar'
import {useList, useListDispatch} from './ParcelListContext';
import PictureCard from './PictureCard';
import ParcelInfoHeader from './ParcelInfoHeader'
import ScoreCard from './ScoreCard'
// import Description from '../Description'
// import useNumberFormat from '../useNumberFormat'
import AuctionBox from './AuctionBox'
import ParcelShareButton from './ParcelShareButton'
import {useUser} from './UserContext'

const InfoCard = (props) => {
	console.log('info card rendered');

	// current logged in user state
	const [user, setUser] = useState();
	const userCont = useUser();
	useEffect(()=>{
		setUser(userCont);
	}, [userCont])

	// get a reference to the infoCard div. This will allow for us to scroll to the top when selected parcel has changed
	let infoCardRef = useRef();

	// get parcelList from context
	let parcelList = useList();

	// initialize the dispatcher for parcelList
	const listDispatch = useListDispatch();

	//let selectedParcel;
	let selectedParcel;

	let parcelsInView;

	// if parcelList is done loading grab parcel that has isSelectedParcel set to true. Should only be 1 in the array, so return first position element.
	if (typeof parcelList != 'undefined') {

		// set selected parcel
		selectedParcel = parcelList.filter((item) => item.Client.isSelectedParcel)[0];

		// scroll to the top of the Info Card if infoCard reference has been set, and there is currently a selectedParcel
		if (selectedParcel && infoCardRef.current) {
			console.log(selectedParcel);
			infoCardRef.current.scrollTo({
				top: 0,
				behavior: 'instant'
			});
		}
		
		console.log(parcelList);
		// set parcels in view
		parcelsInView = parcelList.filter((item) => item.Client.inMapViewBounds);
		console.log(parcelsInView);
		parcelsInView = parcelsInView.map((parcel) => {
			return <ParcelCard parcel={parcel}/>
		});
	}



	let parcel = [];

	let infoLink;

	let title = "Parcels for Auction";

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
	title = "Selected Property";
}

const closeSelectedParcel = () => {
	console.log('closing selected parcel');
	listDispatch({
		type:'resetSelectedParcel'
	})
}

// add selectedParcel to favorites
const addToFavorites = () => {
		let data = JSON.stringify({
			"user": user,
			"parcel_num": selectedParcel.Basic.PARCEL_NUM
		})

		let config = {
			method : 'post',
			url: '/api/addParcelToFavorites',
			headers: {
				    'Content-Type': 'application/json', 
    				'Accept': 'application/json'
			},
			data : data
		};

		axios(config)
		.then((response) => {
			if (response.status == 200) {
			// if user theme update is successful, set the theme here.
			//setUserTheme(event.target.theme.value);
			console.log(response);
			} else {
			//setError('theme not found')
			}
		})
		.catch((error) => {
  		console.log(error);
		});
}

	
	// return (
	// 	<div className='InfoCard'>
	// 			<div className='InfoCardHeader'>
	// 				<h3>{title}</h3>
	// 					{!selectedParcel &&
	// 						<button className='button-17'
	// 							onClick={props.filterButtonPressed}
	// 							> 
	// 							Filters 
	// 						</button>
	// 					}
	// 					{selectedParcel && 
	// 						<button className='button-17'
	// 						onClick={closeSelectedParcel}
	// 						>
	// 						Close 
	// 						</button>
	// 					}
	// 			</div>
	// 		{selectedParcel && <PictureCard selectedParcel={selectedParcel}/>}
	// 		{parcel}
	// 		{parcelsInView && 
	// 			<div className='ParcelCardWrapper'>
	// 				{parcelsInView}
	// 			</div>
	// 		}
	// 	</div>
	// 	)

		if (!selectedParcel) {
			console.log('no selected parcel, rendering parcelsInView');
			console.log(parcelsInView);
			return (
				<div className='InfoCard' ref={infoCardRef}>
					<div className='InfoCardHeader'>
						<h3> {title} </h3>
							<button className='button-17'
								onClick={props.filterButtonPressed}
								> 
								Filters 
							</button>
					</div>
					{parcelsInView && 
						<div className='ParcelCardWrapper'>
							{parcelsInView}
						</div>
					}
				</div>
			)
		} else {
			return (
				<div className='InfoCard' ref={infoCardRef}>
					<div className='InfoCardHeader'>
							<ParcelShareButton parcel={selectedParcel}/>
							<button className='button-17' onClick={addToFavorites}> Favorite </button>
							<button className='button-17' onClick={closeSelectedParcel}> Close </button>
					</div>
					<PictureCard selectedParcel={selectedParcel}/>
					<div className='ScoreCard-Card'>
			    		<ScoreCard parcel = {selectedParcel}/>
			    		<AuctionBox parcel = {selectedParcel}/>
			    	</div>
					{parcel}
				</div>				
				)
		}
	
}

export default InfoCard;

const ParcelCard = (props) => {

	// initialize the dispatcher for parcelList
	const listDispatch = useListDispatch();

	// when user clicks parcel card, send that parcel to selectedParcel
	const handleParcelClick = () => {
		//add selected parcel to context
		listDispatch({
			type: 'setSelected',
			parcelNum: props.parcel.Basic.PARCEL_NUM
		})
	}

	// set isHighlightedParcel when hovering over parcelCard div, this will show which parcel marker is being highlighted in the map.
	const handleParcelHover = () => {
		//console.log('parcelCard being hovered');
		listDispatch({
			type: 'setHighlighted',
			parcelNum: props.parcel.Basic.PARCEL_NUM
		})
	}

	// set image url if it's present
	let imgURL;

	if(props.parcel.Pictures) {
		imgURL = props.parcel.Pictures[0];
	} else {
		imgURL = './missing_icon.png';
	}

	return (
		<div className='ParcelCard' onClick={handleParcelClick} onMouseEnter={handleParcelHover}>
			<img src={imgURL}/>
			<div className='ParcelCardInfo'>
				<p> Tax Value: ${props.parcel.Tax.TAXABLE_TOTAL} </p>
				<p> Auction Date: {props.parcel.Meta.AUCTION_DATE} </p>
				<p> Lot Size: {props.parcel.Land.Acres} </p>
			</div>
		</div>
	)
}