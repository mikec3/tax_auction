import React, {useEffect, useState} from 'react'
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, getDocs } from "firebase/firestore";
// import MyMap from './MyMap.js'
import axios from 'axios'


function GetData(props) {

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
				props.floatParcelListUp(response.data);
			}
		})
		.catch((error) => {
  		console.log(error);
		});
}

useEffect(()=> {
getData()
}, [])

return <></>;
}

export default GetData;

