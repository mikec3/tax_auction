const auction_notes = require('./Read_Auction_Notes');

test('Read Auction Notes', async () => {
	result = await auction_notes.readAuctionNotes('Auction_Notes_2022', '_Auction_Notes');
	//console.log(result);
	resultParsed = result[1]['COUNTY'];

	expect(resultParsed).toMatch('Snohomish');
});

test('Read Parcel List', async () => {
	result = await auction_notes.readAuctionNotes('Auction_Notes_2022', '_Parcel_List');
	//console.log(result);
	resultParsed = result[1]['PARCEL_NUM'];

	expect(resultParsed).toMatch('00373301100301');
});