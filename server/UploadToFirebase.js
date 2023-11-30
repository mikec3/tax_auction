// https://firebase.google.com/docs/firestore/quickstart?hl=en&authuser=0
// Upload parcelInfo to FireBase
require('dotenv').config();
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

	const serviceAccount = require('./firebase_service_account.json');

	initializeApp({
	  credential: cert(serviceAccount)
	});

	const db = getFirestore();


// TODO writing tests to test read

const upload = async function (database, parcelInfo) {

	//console.log(parcelInfo);

	const docRef = db.collection(database).doc(String(parcelInfo.Basic.PARCEL_NUM));

	let results = await docRef.set(parcelInfo);

	//console.log(results);

	return results;
};

const read = async function (database) {

	const docRef = db.collection(database);

	let result = await docRef.get();

	return result;
}

module.exports = {upload, read};