import React, {useState, useEffec, useRef} from 'react'
import InfoBar from './InfoBar';


function InfoBarCard(props) {
	
	let parcel = [];

		for (const [header, entries] of Object.entries(props.selectedParcel)) {
		// ignore certain headers
		if(header != 'location' && header != 'Location' && header != 'Client' && header != 'Pictures') {
			parcel.push(<InfoBar header={header} entries={entries} />)
		}
	}
return (
		<React.Fragment>
		<p> helloooooo!!!@##@$#$#$#$# </p>
		{parcel}
		</React.Fragment>
	);
}

export default InfoBarCard;