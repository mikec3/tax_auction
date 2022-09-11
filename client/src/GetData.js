import React, {useEffect, useState} from 'react'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import MyMap from './MyMap.js'


function GetData(props) {

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCv5bXVnYOryN5FdsZgj9yE1167bKW-KeQ",
  authDomain: "sixth-well-353401.firebaseapp.com",
  projectId: "sixth-well-353401",
  storageBucket: "sixth-well-353401.appspot.com",
  messagingSenderId: "624670306919",
  appId: "1:624670306919:web:fb8a61c55c9219ef149ac2"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// GET THE DATA!!!!!
const getData = async () => {
console.log('Retrieving FireBase Data...')
const snapShot = await getDocs(collection(db, "parcels"));

// store the results in a temporary array of objects
// adds the 'location' part to the object (so markers can read location key)
const tempArray = []
snapShot.forEach((doc) => {
	const rawDoc = doc.data()

	const loc = {
		location: {
			lat: parseFloat(rawDoc.LAT),
			lng: parseFloat(rawDoc.LON)
		}
	}

	const newDoc = {
		...rawDoc,
		...loc
	}

	tempArray.push(newDoc)
})

// float parcel list up to parent component
props.floatParcelListUp(tempArray);
}

useEffect(()=> {
getData()
}, [])

return <></>;
}

export default GetData;

