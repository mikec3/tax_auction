import React, {useState, useEffec, useRef} from 'react'
import useNumberFormat from './useNumberFormat'



function ScoreCard(props) {

let propertyType = 'Land'

if (props.parcel.Tax['TAXABLE_BUILDING'] > 0) {
	propertyType = 'Building'
}

let taxText = 'Tax Assessed \n Value';
let propertyText = 'Property \n Type';

let description = "";

// check if parcel info has a site address or property description
if (typeof props.parcel.Basic['Site Address'] != 'undefined') {
	description = props.parcel.Basic['Site Address'];

} else if (typeof props.parcel.Basic['Property Description'] != 'undefined') {
	description = props.parcel.Basic['Property Description'];
}

if (description.length > 74) {
	description = description.slice(0,75) + "...";
} else {description = description.slice(0,75)}

return (
	<div className='ScoreCard'>
		<div className='ScoreCard-Cell'>
			<h4> {description} </h4>
			<p> Description </p>
		</div>	
		<div className='ScoreCard-Cell'>
			<h4> {useNumberFormat(props.parcel.Tax['TAXABLE_TOTAL'])} </h4>
			<p> {taxText} </p>
		</div>	
		<div className='ScoreCard-Cell'>
			<h4> {props.parcel.Land['Acres']} </h4>
			<p> Acres </p>
		</div>		
		<div className='ScoreCard-Cell'>
			<h4> {propertyType} </h4>
			<p> {propertyText} </p>
		</div>				
	</div>
	);
}

export default ScoreCard;