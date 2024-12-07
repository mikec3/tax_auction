
const pierce = require('./Pierce_Scraper');

// TODO change toMatch to toEqual

// set new timeout for long running tests
jest.setTimeout(50000);


test('Pierce StripLatLon', async () => {
	let rawCoordinates = '+47.193147N -122.776423W';

	// feed rawCoordinates into StripLatLon - expect an array of [lat, lon] string without +,N,W
    let result = pierce.StripLatLon(rawCoordinates);

    console.log(result[0]);

    expect(result[0]).toEqual('47.193147');
    expect(result[1]).toEqual('-122.776423');
});

test('Pierce County Scraper', async () => {

	let result = await pierce.getParcelInfo('https://atip.piercecountywa.gov/app/propertyDetail/',
		'https://matterhornwab.co.pierce.wa.us/publicgis/?find='
		, '0020262018');

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

	expect(fetchedParcelNum).toEqual('0020262018');
	expect(fetchedAddress).toEqual('7019 180TH AVE SW');
	expect(fetchedYear).toEqual('1981');
	expect(fetchedTaxValue).toEqual('44,920');
	expect(fetchedAcres).toEqual(5.09);
	expect(fetchedSquareFeet).toEqual('1,440');
	expect(fetchedLat).toEqual('47.193141');
	//expect(fetchedSaleDate).toEqual('10/01/1999');
	expect(fetchedPicture).toEqual('https://atip.piercecountywa.gov/imageView?parcelNumber=0020262018&fileName=2020_PRI_1-7-2020_EZ_.jpg&imageType=Photos');
});