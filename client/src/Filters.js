import React, {useState, useEffect} from 'react';
import PriceFilter from './Filters/PriceFilter';
import AcreFilter from './Filters/AcreFilter'
import AuctionFilters from './Filters/AuctionFilters'
import {useList, useListDispatch} from './ParcelListContext';

const Filters = (props) => {

// collect all filter settings in this parent component so that all filters get applied to dispatch at the same time.
// collect the initial settings as well for reseting to default
const [priceFilterSettings, setPriceFilterSettings] = useState(null);
const [initialPriceFilterSettings, setInitialPriceFilterSettings] = useState();
const [acreFilterSettings, setAcreFilterSettings] = useState(null);
const [initialAcreFilterSettings, setInitialAcreFilterSettings] = useState();
const [availFilterSettings, setAvailFilterSettings] = useState();
const [initialAvailFilterSettings, setInitialAvailFilterSettings] = useState();
const [onlineFilterSettings, setOnlineFilterSettings] = useState();
const [initialOnlineFilterSettings, setInitialOnlineFilterSettings] = useState();
const [pictureFilterSettings, setPictureFilterSettings] = useState();
const [initialPictureFilterSettings, setInitialPictureFilterSettings] = useState();

const [triggerFilterReset, setTriggerFilterReset] = useState(false);

// get access to parcel list dispatch
const listDispatch = useListDispatch();

// get parcelList
const parcelList = useList();

// apply filters anytime filter settings change
useEffect(()=> {
	// apply filters only after each has been set
	if (priceFilterSettings != null && acreFilterSettings != null) {
		applyFilters();
	}
}, [priceFilterSettings, acreFilterSettings, availFilterSettings, onlineFilterSettings, pictureFilterSettings]);


const handleFilterSettings = (settings) => {
	// save the filter settings according to which filter sent them
	switch(settings.filter){
		case 'price': {
			setPriceFilterSettings(settings.value);
			break;
		}
		case 'acre': {
			setAcreFilterSettings(settings.value);
			break;
		}
		case 'avail': {
			setAvailFilterSettings(settings.value);
			break;
		}
		case 'online': {
			setOnlineFilterSettings(settings.value);
			break;
		}
		case 'picture': {
			setPictureFilterSettings(settings.value);
			break;
		}
		default: {
      throw Error('Unknown filter: ' + settings.filter);
		}
	}
}

// Recieve and save the initial filter settings from each filter component
const setInitialFilterSettings = (settings) => {
	switch(settings.filter){
		case 'price': {
			setInitialPriceFilterSettings(settings.value);
			break;
		}
		case 'acre': {
			setInitialAcreFilterSettings(settings.value);
			break;
		}
		case 'avail': {
			setInitialAvailFilterSettings(settings.value);
			break;
		}
		case 'online': {
			setInitialOnlineFilterSettings(settings.value);
			break;
		}
		case 'picture': {
			setInitialPictureFilterSettings(settings.value);
			break;
		}
		default: {
			throw Error('unknown initial filter setting: ' + settings.filter);
		}
	}
}

// apply filters when apply button is pressed
const applyFilters = () => {
	console.log('applying filters');
	//send all filters to parcel list dispatch
	console.log('online: ' + onlineFilterSettings);
	console.log('picture: ' + pictureFilterSettings);
	listDispatch({
		type: 'filter_apply_all'
		, price: {
			min: priceFilterSettings[0]
			, max: priceFilterSettings[1]
		}
		, acre: {
			min: acreFilterSettings[0]
			, max: acreFilterSettings[1]
		}
		, avail: {
			value: availFilterSettings
		}
		, online: {
			value: onlineFilterSettings
		}
		, picture: {
			value: pictureFilterSettings
		}
	});

	// close the filter box after filters have been applied
	//props.filterButtonPressed();
}

const resetFilters = () => {
	// send filter_reset dispatch. Returns initial Parcel List, effectively resetting all filters.
	listDispatch({
		type: 'filter_reset'
	});

	// reset all the filters
	setPriceFilterSettings(initialPriceFilterSettings);
	setAcreFilterSettings(initialAcreFilterSettings);
	setAvailFilterSettings(initialAvailFilterSettings);
	setOnlineFilterSettings(initialOnlineFilterSettings);
	setPictureFilterSettings(initialPictureFilterSettings);

	// toggle trigger filter reset so that child componenets (filters) will reset in their useEffect that listens for triggerFilterReset.
	if(triggerFilterReset){
		setTriggerFilterReset(false);
	} else {
		setTriggerFilterReset(true);
	}
}

let filterResultsCount;

// only attempt to filter if parcelList is a thing
if (parcelList) {
	// get the count of properties to display as filter results. Filter out items without a location
	filterResultsCount = parcelList.filter(item => item.location.lat != null).length;
}

// props.className will either be FiltersHide or FiltersShow
return (
	<div className={props.className}>
		{parcelList && 
			<React.Fragment>
				<div className='FilterHeader'>
					<div className='FilterResultsCount'>
						<p> {filterResultsCount} </p>
						<p> Results </p>
					</div>
					<h3> Filters </h3>
					<button className='button-17'
						onClick={props.filterButtonPressed}>
							Close
					</button>
				</div>
				<PriceFilter parcelList={parcelList} passUpFilterSettings={handleFilterSettings} 
					setInitialFilterSettings={setInitialFilterSettings} triggerReset={triggerFilterReset}/>

				<AcreFilter parcelList={parcelList} passUpFilterSettings={handleFilterSettings}
					setInitialFilterSettings={setInitialFilterSettings} triggerReset={triggerFilterReset}/>

				<AuctionFilters passUpFilterSettings={handleFilterSettings}
					setInitialFilterSettings={setInitialFilterSettings} triggerReset={triggerFilterReset}/>
					
				<div className='FilterFooter'>
					<button className='button-17' onClick={resetFilters}> Reset </button>
				</div>
			</React.Fragment>
		}
	</div>
	)
	
}

export default Filters;