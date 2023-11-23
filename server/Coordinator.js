const Snohomish = require('./Snohomish_Scraper');
const King = require('./King_Scraper');
const Pierce = require('./Pierce_Scraper');
const Read_Auction_Notes = require('./Read_Auction_Notes');
const Firebase = require('./UploadToFirebase.js');

// call Read_Auction_Notes to get snohomish meta data and parcel list
// pass parcel list through snomohish_scraper and attach meta data to each parcel
// Upload snohomish parcel info to firebase
// get the auction meta data and snohomish parcel info

// TODO add tests
// TODO getSnohomish() and getKing() are basically the same, refactor so that I'm not repeating code.

//let database = 'parcels_v2';

//create definition of which scraper file to call for each countyName
const countyFile = {
	'King': King,
	'Pierce': Pierce,
	'Snohomish': Snohomish,
	'FakeTestCounty': Snohomish
}

// new testing

// get auction notes for meta data, links to parcel info, and parcel list, call each parcel scraper for each parcel and return object of parcel info for upload to db
const getCounty = async function (auctionNotesLoc, countyName) {
	// Get Parcel List
	let parcelList = Read_Auction_Notes.readAuctionNotes(auctionNotesLoc, 'ParcelList').filter(item => item.COUNTY == countyName);

	//  get auction meta data
	let parcelMetaData = Read_Auction_Notes.readAuctionNotes(auctionNotesLoc, 'AuctionNotes').filter(item => item.COUNTY == countyName)[0];

	let parcelOutput = [];

		// loop counter for showing progress
	let increment = 1;

	let listLength = parcelList.length;

		// loop through parcel list
	for await (const parcel of parcelList) {
		console.log(parcel);

		// add meta data to parcelObj
		parcel['AUCTION_DATE'] = parcelMetaData['AUCTION_DATE'];
		parcel['AUCTION_INFO_URL'] = parcelMetaData['AUCTION_INFO_URL'];
		parcel['PARCEL_INFO_URL'] = parcelMetaData['PARCEL_INFO_URL'];
		parcel['PARCEL_DATA_BASE_URL'] = parcelMetaData['PARCEL_DATA_BASE_URL'];
		parcel['PARCEL_VIEWER_URL'] = parcelMetaData['PARCEL_VIEWER_URL'];
		parcel['AUCTION_SITE'] = parcelMetaData['AUCTION_SITE'];
		parcel['AUCTION_SITE_FLAG'] = parcelMetaData['AUCTION_SITE_FLAG'];

		// get the scraper data
		let parcelInfo = await countyFile[countyName].getParcelInfo(parcel['PARCEL_DATA_BASE_URL'],
														parcel['PARCEL_VIEWER_URL'],
														parcel['PARCEL_NUM']);
		// add the metadata to the scraper data
		parcelInfo['Meta'] = parcel;

		// push the full parcel info onto the outputArray
		parcelOutput.push(parcelInfo);


		console.log(parcelInfo);
		console.log(countyName + ' Scraped parcel: ' + increment + ' of ' + listLength);
		increment++;
	};

	// return the output Array
	return parcelOutput;

}

// call scrapers for each county in county list, then upload to firebase.
const Scraper = async function (auctionNotesLoc, countyList, databaseName) {

	let uploadResults = [];

	// loop through counties in countyList and upload parcel data results to firebase.
	for (const countyName of countyList) {

		let results = await getCounty(auctionNotesLoc, countyName);

		for (const result of results) {
			let uploadResult = await Firebase.upload(databaseName, result);
			uploadResults.push(uploadResult);
			//resultsArray.push(uploadResult);
			//console.log(uploadResult);
		}

		// results.forEach(parcel=> {
		// let uploadResult = Firebase.upload(databaseName, parcel);
		// console.log(uploadResult);
	// });	
	}

	return uploadResults;

}

// new way to call, allows for testing too // Scrape(auctionNotesLoc, [countyList], databaseName)
Scraper('Auction_Notes_2022.xlsx', ['Pierce'], 'parcels_v2');

module.exports = {Scraper};



