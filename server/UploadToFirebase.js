// https://firebase.google.com/docs/firestore/quickstart?hl=en&authuser=0
// Upload parcelInfo to FireBase
require('dotenv').config();
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

// TODO need to change to SDK
// TODO writing tests to test read/write

const upload = async function (parcelInfo) {

		// Your web app's Firebase configuration
	const firebaseConfig = {
	  apiKey: String(process.env.fireBaseAPIKey),
	  authDomain: "sixth-well-353401.firebaseapp.com",
	  projectId: "sixth-well-353401",
	  storageBucket: "sixth-well-353401.appspot.com",
	  messagingSenderId: "624670306919",
	  appId: "1:624670306919:web:fb8a61c55c9219ef149ac2"
	};

	const serviceAccount = String(process.env.fireBaseAPIKey);

	initializeApp({
	  credential: cert(serviceAccount)
	});

	const db = getFirestore();

	const docRef = doc(db, 'parcels_test', parcelInfo.Basic.PARCEL_NUM);

	// Add a new document in collection "parcels_v2" label is parcel number
	//const res = await db.collection('parcels_v2').doc(parcelInfo.Basic.PARCEL_NUM).set(parcelInfo);
	const res = await setDoc(docRef, parcelInfo);
	console.log(res);
};

module.exports = {upload};