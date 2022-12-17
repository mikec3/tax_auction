import * as React from 'react'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const PriceFilter = (props) => {
// get max tax values from parcelList
let max = 0;
// props.parcelList.forEach((parcel)=> {
// 	let val = parseInt(parcel.Tax.TAXABLE_TOTAL.replace(/[^0-9]/g, ""));
// 	if (val> max) {
// 		max = val;
// 	}
// })

// const [value, setValue] = React.useState([0, max]);

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
    //setValue(newValue);
    console.log(newValue);
}

return (
	<div className='FilterItem'>

	</div>
)
}

export default PriceFilter;

		// <h2> Taxable Total </h2>
		// 	<Box sx={{ width: 250, margin: 'auto'}}>
		//       <Slider
		//         getAriaLabel={() => 'Temperature range'}
		//         value={value}
		//         onChange={handleChange}
		//         valueLabelDisplay="on"
		//         valueLabelFormat={valuetext}
		//         getAriaValueText={valuetext}
		//         min={0}
		//         max={max}
		//       />
		//     </Box>