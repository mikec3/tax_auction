const Snohomish = require('./Snohomish_Scraper');
const King = require('./King_Scraper');
const Pierce = require('./Pierce_Scraper');
const Read_Auction_Notes = require('./Read_Auction_Notes');
const Firebase = require('./UploadToFirebase.js');

// call Read_Auction_Notes to get snohomish meta data and parcel list
// pass parcel list through snomohish_scraper and attach meta data to each parcel
// Upload snohomish parcel info to firebase
// get the auction meta data and snohomish parcel info

// TODO getSnohomish() and getKing() are basically the same, refactor so that I'm not repeating code.

let database = 'parcels_v2';

const getSnohomish = async function () {
	// Get Snohomish Parcel List
	let snohomishParcelList = Read_Auction_Notes.readAuctionNotes('ParcelList').filter(item => item.COUNTY == 'Snohomish');

	//  get auction meta data
	let snohomishMetaData = Read_Auction_Notes.readAuctionNotes('AuctionNotes').filter(item => item.COUNTY == 'Snohomish')[0];

	let parcelOutput = [];

	// loop counter for showing progress
	let increment = 1;

	let listLength = snohomishParcelList.length;

	// loop through snohomish parcel list
	for await (const parcel of snohomishParcelList) {
		console.log(parcel);

		// add meta data to parcelObj
		parcel['AUCTION_DATE'] = snohomishMetaData['AUCTION_DATE'];
		parcel['AUCTION_INFO_URL'] = snohomishMetaData['AUCTION_INFO_URL'];
		parcel['PARCEL_INFO_URL'] = snohomishMetaData['PARCEL_INFO_URL'];
		parcel['PARCEL_DATA_BASE_URL'] = snohomishMetaData['PARCEL_DATA_BASE_URL'];
		parcel['PARCEL_VIEWER_URL'] = snohomishMetaData['PARCEL_VIEWER_URL'];
		parcel['AUCTION_SITE'] = snohomishMetaData['AUCTION_SITE'];
		parcel['AUCTION_SITE_FLAG'] = snohomishMetaData['AUCTION_SITE_FLAG'];

		// get the scraper data
		let parcelInfo = await Snohomish.getParcelInfo(parcel['PARCEL_DATA_BASE_URL'],
														parcel['PARCEL_VIEWER_URL'],
														parcel['PARCEL_NUM']);
		// add the metadata to the scraper data
		parcelInfo['Meta'] = parcel;

		// push the full parcel info onto the outputArray
		parcelOutput.push(parcelInfo);


		console.log(parcelInfo);
		console.log('Scraped parcel: ' + increment + ' of ' + listLength);
		increment++;
	};

	// return the output Array
	return parcelOutput;
}

const getKing = async function () {
	// Get Snohomish Parcel List
	let KingParcelList = Read_Auction_Notes.readAuctionNotes('ParcelList').filter(item => item.COUNTY == 'King');

	//  get auction meta data
	let kingMetaData = Read_Auction_Notes.readAuctionNotes('AuctionNotes').filter(item => item.COUNTY == 'King')[0];

	let parcelOutput = [];

	// loop counter for showing progress
	let increment = 1;

	let listLength = KingParcelList.length;

	// loop through snohomish parcel list
	for await (const parcel of KingParcelList) {
		//console.log(parcel);

		// add meta data to parcelObj
		parcel['AUCTION_DATE'] = kingMetaData['AUCTION_DATE'];
		parcel['AUCTION_INFO_URL'] = kingMetaData['AUCTION_INFO_URL'];
		parcel['PARCEL_INFO_URL'] = kingMetaData['PARCEL_INFO_URL'];
		parcel['PARCEL_DATA_BASE_URL'] = kingMetaData['PARCEL_DATA_BASE_URL'];

		parcel['PARCEL_VIEWER_URL'] = kingMetaData['PARCEL_VIEWER_URL'];
		parcel['AUCTION_SITE'] = kingMetaData['AUCTION_SITE'];
		parcel['AUCTION_SITE_FLAG'] = kingMetaData['AUCTION_SITE_FLAG'];

		// get the scraper data
		let parcelInfo = await King.getParcelInfo(parcel['PARCEL_DATA_BASE_URL'],
														parcel['PARCEL_VIEWER_URL'],
														parcel['PARCEL_NUM']);
		// add the metadata to the scraper data
		parcelInfo['Meta'] = parcel;

		// push the full parcel info onto the outputArray
		parcelOutput.push(parcelInfo);

		console.log(parcelInfo);
		console.log('Scraped parcel: ' + increment + ' of ' + listLength);

		// uncomment the below break if you want to do any testing and have it stop short of the full length
		increment++;
		if (increment >=20) {
			//break;
		}
	};

	// return the output Array
	return parcelOutput;
}

const getPierce = async function () {
	// Get Snohomish Parcel List
	let PierceParcelList = Read_Auction_Notes.readAuctionNotes('ParcelList').filter(item => item.COUNTY == 'Pierce');

	//  get auction meta data
	let pierceMetaData = Read_Auction_Notes.readAuctionNotes('AuctionNotes').filter(item => item.COUNTY == 'Pierce')[0];

	let parcelOutput = [];

	// loop counter for showing progress
	let increment = 1;

	let listLength = PierceParcelList.length;

	// loop through snohomish parcel list
	for await (const parcel of PierceParcelList) {
		//console.log(parcel);

		// add meta data to parcelObj
		parcel['AUCTION_DATE'] = pierceMetaData['AUCTION_DATE'];
		parcel['AUCTION_INFO_URL'] = pierceMetaData['AUCTION_INFO_URL'];
		parcel['PARCEL_INFO_URL'] = pierceMetaData['PARCEL_INFO_URL'];
		parcel['PARCEL_DATA_BASE_URL'] = pierceMetaData['PARCEL_DATA_BASE_URL'];

		parcel['PARCEL_VIEWER_URL'] = pierceMetaData['PARCEL_VIEWER_URL'];
		parcel['AUCTION_SITE'] = pierceMetaData['AUCTION_SITE'];
		parcel['AUCTION_SITE_FLAG'] = pierceMetaData['AUCTION_SITE_FLAG'];

		// get the scraper data
		let parcelInfo = await Pierce.getParcelInfo(parcel['PARCEL_DATA_BASE_URL'],
														parcel['PARCEL_VIEWER_URL'],
														parcel['PARCEL_NUM']);
		// add the metadata to the scraper data
		parcelInfo['Meta'] = parcel;

		// push the full parcel info onto the outputArray
		parcelOutput.push(parcelInfo);

		console.log(parcelInfo);
		console.log('Scraped parcel: ' + increment + ' of ' + listLength);

		// uncomment the below break if you want to do any testing and have it stop short of the full length
		increment++;
		if (increment >=20) {
			//break;
		}
	};

	// return the output Array
	return parcelOutput;
}

const Scrape = async function () {

	// Uncomment out to re-scrape snohomish. last scrape was 10/12/22.
	// let snohomish = await getSnohomish();
	// snohomish.forEach(parcel => {
	// 	Firebase.upload(database, parcel);
	// });

	// get King County. Uncomment out to rescrape. Developing now.
	// let king = await getKing();
	// king.forEach(parcel=> {
	// 	Firebase.upload(database, parcel);
	// });

	// get Pierce County. Uncomment out to rescrape. Developing now.
	// let pierce = await getPierce();
	// pierce.forEach(parcel=> {
	// 	Firebase.upload(database, parcel);
	// });
}

Scrape();

