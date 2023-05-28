
function Description(props){

let description = "";

// check if parcel info has a site address or property description
if (typeof props.parcel.Basic['Site Address'] != 'undefined') {
	description = props.parcel.Basic['Site Address'];

} else if (typeof props.parcel.Basic['Property Description'] != 'undefined') {
	description = props.parcel.Basic['Property Description'];
}

// chop off the text if it's longer than 99 char
if (description.length > 99) {
	description = description.slice(0,99) + "...";
} else {description = description.slice(0,99)}

return (
	<div className='Description'>
		<h4>{description}</h4>
	</div>
)
}

export default Description;