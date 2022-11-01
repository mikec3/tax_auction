const snohomish = require('./Snohomish_Scraper');

// set new timeout for long running tests
jest.setTimeout(30000);

test('Snohomish Scraper', async () => {

	let result = await snohomish.getParcelInfo('https://www.snoco.org/proptax/search.aspx?parcel_number=00373301100301', '00373301100301');

	// Parse the result to get the specific values I want to test for.
	let fetchedParcelNum = result['Basic']['PARCEL_NUM'];
	let fetchedYear = result['Building']['Year Built'];
	let fetchedLat = result['Location']['LAT'];

	expect(fetchedParcelNum).toMatch('00373301100301');
	expect(fetchedYear).toMatch('1969');
	expect(fetchedLat).toMatch('47.522037057');
});