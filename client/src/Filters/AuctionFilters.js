import React, {useEffect, useState} from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const AuctionFilters = (props) => {

	// configure default availability checkbox value here
	const defaultAvailCheckBoxValue = false;


const [initialLoad, setInitialLoad] = useState(true);

const [availValue, setAvailValue] = useState(defaultAvailCheckBoxValue);

const handleAvailChange = (event) => {

	// toggle availValue
	if (availValue) {
		setAvailValue(false);
		props.passUpFilterSettings({
			filter: 'avail',
			value: false
		})
	} else {
		setAvailValue(true);
		props.passUpFilterSettings({
			filter: 'avail',
			value: true
		})
	}
}

useEffect(()=> {

		// when props.triggerReset is changed (toggles between true/false at parent during filter trigger events), reset values to inital positions.
	setAvailValue(defaultAvailCheckBoxValue);

	if (initialLoad) {
		// pass up filter settings on initial load
		props.passUpFilterSettings({
			filter: 'avail',
			value: availValue
		});
		setInitialLoad(false);
	}
}, [props.triggerReset])


return (
	<div className='FilterItem'>
		<h3> Auction Details </h3>
    	<FormGroup>
      		<FormControlLabel control={<Checkbox checked={availValue} onChange={handleAvailChange} />} label="Still Available" />
      	</FormGroup>
	</div>
)
}

export default AuctionFilters;