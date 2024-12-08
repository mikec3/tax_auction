const coordinator = require('./Coordinator');

// TODO change toMatch to toEqual

// set new timeout for long running tests
jest.setTimeout(50000);

test('Test coordinator script with fake test county request', async () => {

	let actual = await coordinator.Scraper('Auction_Notes/Auction_Notes_2022', ['FakeTestCounty'], 'parcel_test');

	let expected = [{"_writeTime": {"_nanoseconds": 94973000, "_seconds": 1698803779}}];


	console.log(actual);

	expect(actual).not.toBeNull();
	expect(actual[0]).toHaveProperty('_writeTime');

	//expect(actual).toMatchObject(expected);

});