import Table from './Table'

const AnalyticsCard = (props) => {
	//console.log('headerbar.js');


if (typeof props.parcelList != 'undefined') {
return (
	<div>
       Parcel Analytics: {props.parcelList.length} parcels
       <Table parcelList={props.parcelList}/>
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