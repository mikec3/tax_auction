import { countByCountyAndYear } from "./ParcelListUtils";
const Table = (props) => {
	//console.log('headerbar.js');

// get counties and years and number of parcels in each.
// dictionary to hold objects ['King'] = {2023: 50, 2024: 75}
let data = countByCountyAndYear(props.parcelList);

console.log(data);

return (
	<div>
       Parcel Analytics: {props.parcelList.length} parcels
       
	</div>
)

}

export default Table;