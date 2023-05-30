import React, {useState, useEffec, useRef} from 'react'
import useNumberFormat from './useNumberFormat'



function ScoreCard(props) {

let propertyType = 'Land'

if (props.parcel.Tax['TAXABLE_BUILDING'] > 0) {
	propertyType = 'Building'
}

let taxText = 'Tax Assessed \n Value';
let propertyText = 'Property \n Type';

return (
	<div className='ScoreCard'>
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