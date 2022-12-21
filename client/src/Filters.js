import React, {useState, useEffect} from 'react';
import PriceFilter from './Filters/PriceFilter';
import AcreFilter from './Filters/AcreFilter'
import {useList, useListDispatch} from './ParcelListContext';

const Filters = (props) => {

	// TODO filters need to recieve the updated list and re-calculate min-max in real-time
	// TODO show total filter results while filtering
	// TODO filters need to be applied at every value change
	// TODO reset filters

const [priceFilterSettings, setPriceFilterSettings] = useState();
const [acreFilterSettings, setAcreFilterSettings] = useState();

// get access to parcel list dispatch
const listDispatch = useListDispatch();

// get parcelList
const parcelList = useList();

// apply filters anytime pricefiltersettings or acrefilter settings change
useEffect(()=> {
	// apply filters only after each has been set
	if (priceFilterSettings && acreFilterSettings) {
		applyFilters();
	}
}, [priceFilterSettings, acreFilterSettings]);


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
		default: {
      throw Error('Unknown filter: ' + settings.filter);
		}
	}
}

// apply filters when apply button is pressed
const applyFilters = () => {
	console.log('applying filters');
	//send all filters to parcel list dispatch
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
	});

	// close the filter box after filters have been applied
	//props.filterButtonPressed();
}

// props.className will either be FiltersHide or FiltersShow
return (
	<div className={props.className}>
		{parcelList && 
			<React.Fragment>
			<div className='FilterButtonWrapper'>
				<button className='FilterCloseButton'
					onClick={props.filterButtonPressed}>
						X 
				</button>
				<h2> Filters </h2>
				<button className='FilterCloseButton'
					onClick={applyFilters}>
						Apply
				</button>

			</div>
			<PriceFilter parcelList={parcelList} passUpFilterSettings={handleFilterSettings}/>
			<AcreFilter parcelList={parcelList} passUpFilterSettings={handleFilterSettings}/>
			</React.Fragment>
		}
	</div>
	)
	
}

export default Filters;