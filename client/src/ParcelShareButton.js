import React, {useState, useEffec, useRef} from 'react'



function ParcelShareButton(props) {

	const [buttonText, setButtonText] = useState('Share');
	
const shareParcel = () => {
	console.log(props.parcel);
	navigator.clipboard.writeText("https://www.countyauctionproperties.com/ParcelPage?parcel="+props.parcel.Basic.PARCEL_NUM)
	setButtonText('Copied');
}

return (
	<div>
		<button className='button-17'
			onClick={shareParcel}>
			{buttonText} 
		</button>
	</div>
	);
}

export default ParcelShareButton;