
const thurston = require('./Thurston_Scraper');

// TODO change toMatch to toEqual

// set new timeout for long running tests
jest.setTimeout(50000);

test('Thurston County Scraper', async () => {

	let result = await thurston.getParcelInfo('https://tcproperty.co.thurston.wa.us/propsql/basic.asp?fe=PR&pn=',
		'https://map.co.thurston.wa.us/Html5Viewer/index.html?viewer=uMap.Main&run=FindParcelsByIDs&pids='
		, '09680077001');

	console.log(result);

	// Parse the result to get the specific values I want to test for.
	let fetchedParcelNum = result['Basic']['PARCEL_NUM'];
	let fetchedAddress = result['Basic']['Site Address'];
	let fetchedYear = result['Building']['Year Built'];
	let fetchedTaxValue = result['Tax']['Taxable Value'];
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
	expect(fetchedTaxValue).toEqual('597,600');
	expect(fetchedLat).toEqual('47.193147');
	//expect(fetchedSaleDate).toEqual('10/01/1999');
	expect(fetchedPicture).toEqual('https://atip.piercecountywa.gov/imageView?parcelNumber=0020262018&fileName=2020_PRI_1-7-2020_EZ_.jpg&imageType=Photos');
});