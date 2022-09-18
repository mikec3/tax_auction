// server/index.js

const express = require("express");
const path = require('path');
const bodyParser = require("body-parser")
require('dotenv').config();
const http = require('http');
const {Server} = require('socket.io');
const axios = require('axios');

const {initializeApp} = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const PORT = process.env.PORT || 3001;

const app = express();

const server = http.createServer(app);
const io = new Server(server);

// using this for reading webhook posts
app.use(bodyParser.json())

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Send up the parcel data
app.get("/api/parcelData", async function(req, res){

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: String(process.env.fireBaseAPIKey),
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

// return the parcel list to client
res.json(await getData(db));

});

// GET THE DATA!!!!!
const getData = async (db) => {
console.log('Retrieving FireBase Data...')
const snapShot = await getDocs(collection(db, "parcels_v2"));

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