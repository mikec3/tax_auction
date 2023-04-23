import React, {useState, useEffec, useRef} from 'react'



function ParcelShareButton(props) {
	
const shareParcel = () => {
	console.log(props.parcel);
	navigator.clipboard.writeText("https://www.countyauctionproperties.com/ParcelPage?parcel="+props.parcel.Basic.PARCEL_NUM)
}

return (
	<div>
		<button className='button-17'
			onClick={shareParcel}>
			Share 
		</button>
	</div>
	);
}

export default ParcelShareButton;