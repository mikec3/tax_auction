// server/index.js

const express = require("express");
const path = require('path');
const bodyParser = require("body-parser")
require('dotenv').config();
const http = require('http');
const {Server} = require('socket.io');
const axios = require('axios');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { getAuth, createUser, updateProfile, verifyIdToken } = require("firebase-admin/auth");

const PORT = process.env.PORT || 3001;

const app = express();

const server = http.createServer(app);
const io = new Server(server);

// using this for reading webhook posts
app.use(bodyParser.json())

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

	// firebase admin key is saved in .env file all whitespace line breaks was erased so that the .env reads it as one continuous string
	const serviceAccount = JSON.parse(process.env.fireBaseAdminKey);

	initializeApp({
	  credential: cert(serviceAccount)
	});

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();

// Initialize Firebase Firestore and get a reference to the service
const db = getFirestore();

// Send up the parcel data
app.get("/api/parcelData", async function(req, res){

	const db = getFirestore();

// return the parcel list to client
res.json(await getData(db));

});

// GET THE DATA!!!!!
const getData = async (db) => {
console.log('Retrieving FireBase Data...')
const docRef = db.collection("parcels_v2");
const snapShot = await docRef.get();

//console.log(snapShot);

//store the results in a temporary array of objects
//adds the 'location' part to the object (so markers can read location key)
const tempArray = []
snapShot.forEach((doc) => {
	//console.log(doc.data);
	const rawDoc = doc.data()

	const loc = {
		location: {
			lat: parseFloat(rawDoc.Location.LAT),
			lng: parseFloat(rawDoc.Location.LON)
		}
	}

	const newDoc = {
		...rawDoc,
		...loc
	}

	tempArray.push(newDoc)
})
return tempArray;
}

// api for adding parcel numbers to favorites list
app.post("/api/addParcelToFavorites", async function(req, res) {
	console.log('api/addParcelToFavorites called');

	// validate token
	auth.verifyIdToken(req.body.user.stsTokenManager.accessToken)
	.then((decodedToken)=> {
		//console.log(decodedToken.uid);

		// set db users/{uid}/theme
		uploadNewFavoriteParcel(decodedToken.uid, req.body.parcel_num)
		.then((response)=> {
			res.json(response);
		});
	})
	.catch((error)=> {
		console.log(error);
		res.json(error);
	})

	// return new theme or success message
});

// TODO change to appending to the list of favorites
const uploadNewFavoriteParcel = async function (uid, parcel_num) {

	const docRef = db.collection('users').doc(uid).collection('Favorites').doc('Parcel_Numbers')

	let upload_list = [parcel_num];

		// docRef.get()
		// .then(result=>{
		// 	// if there's a result, pass it back to client, otherwise pass null
		// 	if (result.data()) {
		// 		console.log(result);
		// 		console.log(result.data());
		// 		//res.json(result.data().theme);
		// 	} else {
		// 		//res.json();
		// 	}
		// })

	// get current favorites list so that we can append to it and re-upload
	let currentFavList = await docRef.get();
	console.log(currentFavList);
	console.log(currentFavList.data());

	// if the current fav list has data, then add the new parcel into the current list
	if (typeof currentFavList.data() !== 'undefined') {
		console.log('Looks like there is data in the favorites list already, adding new parcel to list');
		upload_list = [...currentFavList.data().list, parcel_num]
	}

	docRef.set({list:upload_list})
	.then(result => {
		console.log(result);
		// return the parcel number if write was successful
		return result;
	}).catch(error => {
		console.log(error);
		return error;
	})
};

// API get call for getting user's favorites
app.post("/api/getUserFavorites", async function(req, res){

	// validate token
	let decodedToken = await auth.verifyIdToken(req.body.user.stsTokenManager.accessToken)

	let uid = decodedToken.uid;

	// doc ref to user requesting favorites
	let docRef = db.collection('users').doc(uid).collection('Favorites').doc('Parcel_Numbers');

	docRef.get()
	.then((result) => {
		// if there are results, returen them, otherwise return empty array. front end will read empty array and do nothing with it.
		if (typeof result.data() != 'undefined') {
			res.json(result.data().list);
		} else {
			res.json([]);
		}
	})
	.catch(error=>{
		console.log(error);
		res.json(error);
	})

});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// WEBSOCKETS!!!!
// on connection console log the unique id for the client
io.on('connection', (socket) => {
  //console.log('a user connected');
  console.log(socket.id);

  // NOT SECURE!!!!!!!!!!!!!!!!!!!!
  // send google maps API Key back to client upon connection
  io.emit('message', {"googleMapsAPIKey" : String(process.env.googleMapsAPIKey)})
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});