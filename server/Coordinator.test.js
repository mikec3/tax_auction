const coordinator = require('./Coordinator');

// TODO change toMatch to toEqual

// set new timeout for long running tests
jest.setTimeout(50000);

test('Test coordinator script with fake test county request', async () => {

	let result = await coordinator.Scraper('Auction_Notes_2022.xlsx', ['FakeTestCounty'], 'parcel_test');

	console.log(result);

	expect(result).toEqual(true);

});