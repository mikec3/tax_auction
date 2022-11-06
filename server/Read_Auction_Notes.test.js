const auction_notes = require('./Read_Auction_Notes');

test('Read Auction Notes', () => {
	result = auction_notes.readAuctionNotes('AuctionNotes');
	resultParsed = result[0]['COUNTY'];

	expect(resultParsed).toMatch('Snohomish');
});

test('Read Parcel List', () => {
	result = auction_notes.readAuctionNotes('ParcelList');
	resultParsed = result[0]['PARCEL_NUM'];

	expect(resultParsed).toMatch('00373301100301');
});