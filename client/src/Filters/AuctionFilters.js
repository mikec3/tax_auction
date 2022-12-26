import React, {useEffect, useState} from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const AuctionFilters = (props) => {

	// configure default availability checkbox value here
	const defaultAvailCheckBoxValue = false;
	const defaultOnlineCheckBoxValue = false;


const [initialLoad, setInitialLoad] = useState(true);

const [availValue, setAvailValue] = useState(defaultAvailCheckBoxValue);
const [onlineValue, setOnlineValue] = useState(defaultOnlineCheckBoxValue);

const handleAvailChange = (event) => {

	// toggle availValue
	if (availValue) {
		setAvailValue(false);
		props.passUpFilterSettings({
			filter: 'avail',
			value: false
		});
	} else {
		setAvailValue(true);
		props.passUpFilterSettings({
			filter: 'avail',
			value: true
		});
	}
}

const handleOnlineChange = (event) => {
		// toggle availValue
	if (onlineValue) {
		setOnlineValue(false);
		props.passUpFilterSettings({
			filter: 'online',
			value: false
		})
	} else {
		setOnlineValue(true);
		props.passUpFilterSettings({
			filter: 'online',
			value: true
		})
	}
}

useEffect(()=> {

		// when props.triggerReset is changed (toggles between true/false at parent during filter trigger events), reset values to inital positions.
	setAvailValue(defaultAvailCheckBoxValue);
	setOnlineValue(defaultOnlineCheckBoxValue);

	if (initialLoad) {
		// pass up filter settings on initial load
		props.passUpFilterSettings({
			filter: 'avail',
			value: availValue
		});
		props.passUpFilterSettings({
			filter: 'online',
			value: onlineValue
		})
		setInitialLoad(false);
	}
}, [props.triggerReset])


return (
	<div className='FilterItem'>
		<h3> Auction Details </h3>
    	<div className='FormGroup'>
      		<FormControlLabel control={<Checkbox checked={availValue} onChange={handleAvailChange} />} label="Still Available" />
      		<FormControlLabel control={<Checkbox checked={onlineValue} onChange={handleOnlineChange} />} label="Online Auction Only" />
      	</div>
	</div>
)
}

export default AuctionFilters;