import React, {useEffect, useState} from 'react'
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, getDocs } from "firebase/firestore";
// import MyMap from './MyMap.js'
import axios from 'axios'
import {useListDispatch} from './ParcelListContext';


function GetData(props) {

	// give access to the list dispatcher
	const listDispatch = useListDispatch();

	let results;

// GET THE DATA!!!!!
const getData = async () => {
console.log('Retrieving FireBase Data...')

		let config = {
			method : 'get',
			url: '/api/parcelData',
			headers: {
				    'Content-Type': 'application/json', 
    				'Accept': 'application/json' 
			}
		};

		axios(config)
		.then((response) => {
			//console.log(JSON.stringify(response.data))
			//console.log(response.data)
			if (response.data != 'error') {
				// float parcel list up to parent component
				//props.floatParcelListUp(response.data);
				results = response.data
				// send results to context
				listDispatch({
					type: 'initialize',
					payload: results
				})
			}
		})
		.catch((error) => {
  		console.log(error);
		});
}

useEffect(()=> {
getData()
}, []);

return (<></>);
}

export default GetData;

