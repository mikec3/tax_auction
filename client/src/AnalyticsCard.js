

const AnalyticsCard = (props) => {
	//console.log('headerbar.js');


if (typeof props.parcelList != 'undefined') {
return (
	<div>
       Parcel Analytics: {props.parcelList.length} parcels
	</div>
)} else {
    return (
        <div>
            No Parcels yet
        </div>
    )
}

}

export default AnalyticsCard;