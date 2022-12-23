import React, {useEffect, useState} from 'react'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import {useListDispatch} from '../ParcelListContext';

const PriceFilter = (props) => {
	console.log('price filter rendered');
// get max tax values from parcelList
let max = 0;
props.parcelList.forEach((parcel)=> {
	//let val = parseInt(parcel.Tax.TAXABLE_TOTAL.replace(/[^0-9]/g, ""));
	let val = parcel.Tax.TAXABLE_TOTAL;
	if (val> max) {
		max = val;
	}
})

const [value, setValue] = useState([0, max]);
const [priceMax, setPriceMax] = useState();

useEffect(()=> {
	// only set price max on first time, so that it's always the max of the unfiltered set.
	setPriceMax(max);

	// when props.triggerReset is changed (toggles between true/false at parent during filter trigger events), reset values to inital positions.
	setValue([0,max]);
	
	// pass up filter settings on initial load so that filter component has them
	props.passUpFilterSettings({
		filter: 'price',
		value: value
	});
}, [props.triggerReset])

// get access to the parcel list dispatch
const listDispatch = useListDispatch();

// change formatting of slider labels
function valuetext(sliderValue) {

		// if number is over 1M
	if (sliderValue >= 1000000) {

		// rounding to 1 decimal for millions
		let mill = sliderValue/1000000
		mill = +mill.toFixed(1);
		return String(mill)+"M"

	// if number is less than 1M
	} else {
		// rounding to nearest integer for thousands
		return String(parseInt(sliderValue/1000))+"K"
	}
}

const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);

    // pass up filter settings to the filter component
    	props.passUpFilterSettings({
		filter: 'price',
		value: newValue
	});
}


return (
	<div className='FilterItem'>
		<h2> Taxable Total </h2>
			<Box sx={{ width: 250, margin: 'auto'}}>
		      <Slider
		        getAriaLabel={() => 'Temperature range'}
		        value={value}
		        onChange={handleChange}
		        valueLabelDisplay="on"
		        valueLabelFormat={valuetext}
		        getAriaValueText={valuetext}
		        min={0}
		        max={priceMax}
		      />
		    </Box>
	</div>
)
}

export default PriceFilter;

