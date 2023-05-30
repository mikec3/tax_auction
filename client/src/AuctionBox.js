import React, {useState, useEffec, useRef} from 'react'
//import useNumberFormat from './useNumberFormat'



function AuctionBox(props) {


return (
	<div className='AuctionBox'>
		<h4> {props.parcel.Meta['COUNTY']} County Auction </h4>
		<p> {props.parcel.Meta['AUCTION_DATE']} </p>
		<a href={props.parcel.Meta['AUCTION_SITE']}> {props.parcel.Meta['AUCTION_SITE']} </a>
			
	</div>
	);
		}

export default AuctionBox;