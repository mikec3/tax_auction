import React, {useEffect, useState} from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {useListDispatch} from '../ParcelListContext';

const AuctionFilters = (props) => {


const [initialLoad, setInitialLoad] = useState(true);

const [availValue, setAvailValue] = useState(true);


// get access to the parcel list dispatch
const listDispatch = useListDispatch();

const handleAvailChange = (event) => {
	console.log(event);

	// toggle availValue
	if (availValue) {
		setAvailValue(false);
	} else {
		setAvailValue(true);
	}
}


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