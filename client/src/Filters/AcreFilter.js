import React, {useEffect, useState} from 'react'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import {useListDispatch} from '../ParcelListContext';

const AcreFilter = (props) => {
// get max tax values from parcelList
let max = 0;
props.parcelList.forEach((parcel)=> {
	//let val = parseInt(parcel.Tax.TAXABLE_TOTAL.replace(/[^0-9]/g, ""));
	let val = parcel.Land.Acres;
	if (val> max) {
		max = val;
	}
})

const [value, setValue] = useState([0, max]);
const [lotSizeMax, setLotSizeMax] = useState();
const [initialLoad, setInitialLoad] = useState(true);

useEffect(()=> {
	// only set price max on first time, so that it's always the max of the unfiltered set.
	setLotSizeMax(max);

		// when props.triggerReset is changed (toggles between true/false at parent during filter trigger events), reset values to inital positions.
	setValue([0,max]);

	if (initialLoad) {
		// pass up filter settings on initial load
		props.passUpFilterSettings({
			filter: 'acre',
			value: value
		});
		setInitialLoad(false);
	}
}, [props.triggerReset])

// get access to the parcel list dispatch
const listDispatch = useListDispatch();

function valuetext(sliderValue) {
	return sliderValue;
}

const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);

 	// pass up filter settings
 		props.passUpFilterSettings({
		filter: 'acre',
		value: newValue
	});
}

return (
	<div className='FilterItem'>
		<h3> Lot Size (Acres) </h3>
			<Box sx={{ width: 250, margin: 'auto'}}>
		      <Slider
		        getAriaLabel={() => 'Temperature range'}
		        value={value}
		        onChange={handleChange}
		        valueLabelDisplay="on"
		        valueLabelFormat={valuetext}
		        getAriaValueText={valuetext}
		        min={0}
		        max={lotSizeMax}
		      />
		    </Box>
	</div>
)
}

export default AcreFilter;