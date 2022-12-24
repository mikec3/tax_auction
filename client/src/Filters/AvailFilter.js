import React, {useEffect, useState} from 'react'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import {useListDispatch} from '../ParcelListContext';

const AvailFilter = (props) => {


const [initialLoad, setInitialLoad] = useState(true);

useEffect(()=> {
	// only set price max on first time, so that it's always the max of the unfiltered set.
	setLotSizeMax(max);

		// when props.triggerReset is changed (toggles between true/false at parent during filter trigger events), reset values to inital positions.
	setValue([0,max]);

	if (initialLoad) {
		// pass up filter settings on initial load
		props.passUpFilterSettings({
			filter: 'avail',
			value: value
		});
		setInitialLoad(false);
	}
}, [props.triggerReset])

// get access to the parcel list dispatch
const listDispatch = useListDispatch();

const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);

 	// pass up filter settings
 		props.passUpFilterSettings({
		filter: 'avail',
		value: newValue
	});
}

return (
	<div className='FilterItem'>
		<h3> Auction Details </h3>

	</div>
)
}

export default AvailFilter;