
const king_county = require('./King_Scraper');

// TODO change toMatch to toEqual

// set new timeout for long running tests
jest.setTimeout(50000);

test('King County Scraper', async () => {

	let result = await king_county.getParcelInfo('https://blue.kingcounty.com/Assessor/eRealProperty/Dashboard.aspx?ParcelNbr=',
		'https://gismaps.kingcounty.gov/iMap/'
		, '3343301023');

	console.log(result);

	// Parse the result to get the specific values I want to test for.
	let fetchedParcelNum = result['Basic']['PARCEL_NUM'];
	let fetchedYear = result['Building']['Year Built'];
	let fetchedLat = result['Location']['LAT'];

	expect(fetchedParcelNum).toMatch('3343301023');
	expect(fetchedYear).toMatch('2016');
	expect(fetchedLat).toMatch('47.54411');
});
