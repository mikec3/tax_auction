import React, {useEffect, useState} from 'react'
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, getDocs } from "firebase/firestore";
// import MyMap from './MyMap.js'
import axios from 'axios'


async function useGetData(props) {

const [responseData, setResponseData] = useState();

useEffect(()=> {
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

		// axios(config)
		// .then((response) => {
		// 	//console.log(JSON.stringify(response.data))
		// 	//console.log(response.data)
		// 	if (response.data != 'error') {
		// 		// float parcel list up to parent component
		// 		//props.floatParcelListUp(response.data);
		// 		return response.data;
		// 	}
		// })
		// .catch((error) => {
  // 		console.log(error);

  // 		return error;
		// });

		let apiCall = await axios(config);
		setResponseData(apiCall.data);
}

getData();

}, []);

console.log(responseData);

return responseData;

}

export default useGetData;

