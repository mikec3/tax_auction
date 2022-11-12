const snohomish = require('./Snohomish_Scraper');

// set new timeout for long running tests
jest.setTimeout(30000);

test('Snohomish Scraper', async () => {

	let result = await snohomish.getParcelInfo('https://www.snoco.org/proptax/search.aspx?parcel_number=',
		'https://scopi.snoco.org/Html5Viewer/Index.html?configBase=https://scopi.snoco.org/Geocortex/Essentials/REST/sites/SCOPI/viewers/SCOPI/virtualdirectory/Resources/Config/Default' ,
		'00373301100301');

	// Parse the result to get the specific values I want to test for.
	let fetchedParcelNum = result['Basic']['PARCEL_NUM'];
	let fetchedYear = result['Building']['Year Built'];
	let fetchedLat = result['Location']['LAT'];

	expect(fetchedParcelNum).toMatch('00373301100301');
	expect(fetchedYear).toMatch('1969');
	expect(fetchedLat).toMatch('47.87233');
});

// test the lat/lon cleanup
test('Lat/Lon raw to final value', () => {

	let latRaw = "48° 3' 50.72918' N";
	let lonRaw = "121° 54' 45.03040' W";

	expect(snohomish.CleanLatLon(latRaw, lonRaw)).toStrictEqual(['48.06409', '-121.91251'])
})

// test the lat/long degree to decimal converter
test('Decimal Converter', () => {
	expect(snohomish.ConvertToDecimal(39, 25, 30.91)).toMatch('39.42525');
})