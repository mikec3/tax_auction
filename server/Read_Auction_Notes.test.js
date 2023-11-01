const auction_notes = require('./Read_Auction_Notes');

test('Read Auction Notes', () => {
	result = auction_notes.readAuctionNotes('Auction_Notes_2022.xlsx', 'AuctionNotes');
	resultParsed = result[0]['COUNTY'];

	expect(resultParsed).toMatch('Snohomish');
});

test('Read Parcel List', () => {
	result = auction_notes.readAuctionNotes('Auction_Notes_2022.xlsx', 'ParcelList');
	resultParsed = result[0]['PARCEL_NUM'];

	expect(resultParsed).toMatch('00373301100301');
});