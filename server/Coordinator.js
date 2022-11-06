const Snohomish = require('./Snohomish_Scraper');
const Read_Auction_Notes = require('./Read_Auction_Notes');

// call Read_Auction_Notes to get snohomish meta data and parcel list
// pass parcel list through snomohish_scraper and attach meta data to each parcel
// TODO cont... Upload snohomish parcel info to firebase
// get the auction meta data and snohomish parcel info

const getSnohomish = async function () {
	// Get Snohomish Parcel List
	let snohomishParcelList = Read_Auction_Notes.readAuctionNotes('ParcelList').filter(item => item.COUNTY == 'Snohomish');

	//  get auction meta data
	let snohomishMetaData = Read_Auction_Notes.readAuctionNotes('AuctionNotes').filter(item => item.COUNTY == 'Snohomish')[0];

	let parcelOutput = [];

	// loop through snohomish parcel list
	for await (const parcel of snohomishParcelList) {
		//console.log(parcelObj.PARCEL_NUM)

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

		// TODO exit after the first loop TODO remove this
		break;

	};

	// return the output Array
	return parcelOutput;
}

getSnohomish().then(result=> {console.log(result)});

