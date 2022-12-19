import * as React from 'react';
import PriceFilter from './Filters/PriceFilter';
import {useList, useListDispatch} from './ParcelListContext';

const Filters = (props) => {

// get parcelList
const parcelList = useList();

// props.className will either be FiltersHide or FiltersShow
return (
	<div className={props.className}>
	{parcelList && 
		<React.Fragment>
		<div className='FilterButtonWrapper'>
			<h2> Filters </h2>
			<button className='FilterCloseButton'
				onClick={props.filterButtonPressed}>
					X 
			</button>
		</div>
		<PriceFilter parcelList={parcelList}/>
		</React.Fragment>
	}
	</div>
)
}

export default Filters;