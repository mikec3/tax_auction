import React, {useState, useEffec, useRef} from 'react'
import ParcelShareButton from './ParcelShareButton'



function ParcelInfoHeader(props) {
	

return (
	<div>
		<ParcelShareButton parcel={props.parcel}/>
	</div>
	);
}

export default ParcelInfoHeader;