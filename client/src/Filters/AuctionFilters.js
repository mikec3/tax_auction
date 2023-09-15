import React, {useEffect, useState} from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const AuctionFilters = (props) => {

	// configure default availability checkbox value here
	const defaultAvailCheckBoxValue = false;
	const defaultOnlineCheckBoxValue = false;
	const defaultPictureCheckBoxValue = false;


const [initialLoad, setInitialLoad] = useState(true);

const [availValue, setAvailValue] = useState(defaultAvailCheckBoxValue);
const [onlineValue, setOnlineValue] = useState(defaultOnlineCheckBoxValue);
const [pictureValue, setPictureValue] = useState(defaultPictureCheckBoxValue);

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

const handlePictureChange = (event) => {
		// toggle availValue
	if (pictureValue) {
		setPictureValue(false);
		props.passUpFilterSettings({
			filter: 'picture',
			value: false
		})
	} else {
		setPictureValue(true);
		props.passUpFilterSettings({
			filter: 'picture',
			value: true
		})
	}
}

useEffect(()=> {

		// when props.triggerReset is changed (toggles between true/false at parent during filter trigger events), reset values to inital positions.
	setAvailValue(defaultAvailCheckBoxValue);
	setOnlineValue(defaultOnlineCheckBoxValue);
	setPictureValue(defaultPictureCheckBoxValue);

	console.log('auction filters getting reset');

	if (initialLoad) {
		// pass up filter settings on initial load
		props.passUpFilterSettings({
			filter: 'avail',
			value: availValue
		});
		props.passUpFilterSettings({
			filter: 'online',
			value: onlineValue
		});
		props.passUpFilterSettings({
			filter: 'picture',
			value: pictureValue
		})

		// pass up initial settings so that filter component can reset to these values when needed.
		props.setInitialFilterSettings({
			filter: 'avail',
			value: availValue
		});
		props.setInitialFilterSettings({
			filter: 'online',
			value: onlineValue
		});
		props.setInitialFilterSettings({
			filter: 'picture',
			value: pictureValue
		});
		setInitialLoad(false);
	}
}, [props.triggerReset])


return (
	<div className='FilterItem'>
		<h3> Auction Details </h3>
    	<div className='FormGroup'>
      		<FormControlLabel control={<Checkbox checked={availValue} onChange={handleAvailChange} />} label="Auction Pending" />
      		<FormControlLabel control={<Checkbox checked={onlineValue} onChange={handleOnlineChange} />} label="Online Auction Only" />
      		<FormControlLabel control={<Checkbox checked={pictureValue} onChange={handlePictureChange} />} label="Has Picture Only" />
      	</div>
	</div>
)
}

export default AuctionFilters;