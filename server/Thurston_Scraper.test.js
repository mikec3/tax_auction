
const thurston = require('./Thurston_Scraper');

// TODO change toMatch to toEqual

// set new timeout for long running tests
jest.setTimeout(50000);

test('Thurston County Scraper', async () => {

	let result = await thurston.getParcelInfo('https://tcproperty.co.thurston.wa.us/propsql/basic.asp?fe=PR&pn=',
		'https://map.co.thurston.wa.us/parcelinfo/details.ext.html?id='
		, '09680077001');

	console.log(result);

	// Parse the result to get the specific values I want to test for.
	let fetchedParcelNum = result['Basic']['PARCEL_NUM'];
	let fetchedAddress = result['Basic']['Site Address'];
	let fetchedYear = result['Building']['Year Built'];
	let fetchedTaxValue = result['Tax']['TAXABLE_TOTAL'];
	let fetchedAcres = result['Land']['Acres'];
	let fetchedSquareFeet = result['Building']['Square Feet'];
	let fetchedLat = result['Location']['LAT'];
	//let fetchedSaleDate = result['History']['Sale Date'];
	let fetchedPicture = result['Pictures'][0];

	expect(fetchedParcelNum).toEqual('09680077001');
	expect(fetchedAddress).toEqual('2215 CHARLIE ST NE,  OLYMPIA');
	expect(fetchedYear).toEqual('2008');
	expect(fetchedSquareFeet).toEqual('1215');
	expect(fetchedAcres).toEqual(0.12);
	expect(fetchedTaxValue).toEqual(587400);
	expect(fetchedPicture).toEqual('https://tcproperty.co.thurston.wa.us/propsql/photos/09680077001.jpg');
	expect(fetchedLat).toEqual('47.0650021');
	//expect(fetchedSaleDate).toEqual('10/01/1999');
});