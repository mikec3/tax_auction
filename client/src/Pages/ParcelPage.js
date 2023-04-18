import React, {useState, useEffect} from 'react'
import HeaderBar from '../HeaderBar.js'
import {useList, useListDispatch} from '../ParcelListContext';
import GetData from '../GetData'; // need to include this to initialize the parcel list context
import PictureCard from '../PictureCard';
import InfoBarCard from '../InfoBarCard';


function ParcelPage() {

	//get parcel list from context
	let parcelList = useList();

	console.log(parcelList);

	let searchParam = new URLSearchParams(window.location.search);

	let searchParamParcelNum = searchParam.get('parcel');

	console.log(searchParamParcelNum);
	//console.log(searchParam.toString());

	let selectedParcel;

	if (typeof parcelList != 'undefined') {
		console.log(parcelList.filter(item=> item.Basic.PARCEL_NUM == searchParamParcelNum));
		selectedParcel = parcelList.filter(item=> item.Basic.PARCEL_NUM == searchParamParcelNum)[0];
	}


  return (
    	<React.Fragment>
    			<GetData/>
			    <HeaderBar/>
			    <p> hellooo!! </p>
			    {parcelList &&
			    	<React.Fragment>
			    		<PictureCard selectedParcel={selectedParcel}/>
			    		<InfoBarCard selectedParcel={selectedParcel}/>
			    	</React.Fragment>
				}
	    </React.Fragment>
  )
}

export default ParcelPage;