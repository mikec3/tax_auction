import * as React from 'react';
import PriceFilter from './Filters/PriceFilter';

const Filters = (props) => {

	

// props.className will either be FiltersHide or FiltersShow
return (
	<div className={props.className}>
		<div className='FilterButtonWrapper'>
			<button className='FilterCloseButton'
				onClick={props.filterButtonPressed}>
					X 
			</button>
		</div>

		<PriceFilter parcelList={props.parcelList}/>
		
	</div>
)
}

export default Filters;