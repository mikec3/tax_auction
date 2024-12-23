const Snohomish = require('./Scrapers/Snohomish_Scraper.js');
const King = require('./Scrapers/King_Scraper.js');
const Pierce = require('./Scrapers/Pierce_Scraper.js');
const Thurston = require('./Scrapers/Thurston_Scraper.js');
const Read_Auction_Notes = require('./Read_Auction_Notes');
const Firebase = require('./UploadToFirebase.js');


//create definition of which scraper file to call for each countyName
const countyFile = {
	'King': King,
	'Pierce': Pierce,
	'Snohomish': Snohomish,
	'Thurston': Thurston,
	'FakeTestCounty': Snohomish
}

// new testing

// get auction notes for meta data, links to parcel info, and parcel list, call each parcel scraper for each parcel and return object of parcel info for upload to db
const getCounty = async function (auctionNotesLoc, countyName) {
	// Get Parcel List
	let parcelListRaw = await Read_Auction_Notes.readAuctionNotes(auctionNotesLoc, '_Parcel_List');

	let parcelList = parcelListRaw.filter(item => item.COUNTY == countyName);

	//  get auction meta data
	let parcelMetaDataRaw = await Read_Auction_Notes.readAuctionNotes(auctionNotesLoc, '_Auction_Notes');

	let parcelMetaData = parcelMetaDataRaw.filter(item => item.COUNTY == countyName)[0];

	let parcelOutput = [];

		// loop counter for showing progress
	let increment = 1;

	let listLength = parcelList.length;

		// loop through parcel list
	for await (const parcel of parcelList) {
		//console.log(parcel);

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


		//console.log(parcelInfo);
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
//Scraper('Auction_Notes_2023', ['King', 'Pierce', 'Snohomish'], 'parcels_v2');
//Scraper('Auction_Notes_2023', ['King'], 'parcels_v2');

module.exports = {Scraper};



