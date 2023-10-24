const snohomish = require('./Snohomish_Scraper');
const king_county = require('./King_Scraper');
const pierce = require('./Pierce_Scraper');

// TODO change toMatch to toEqual & add time limits that each test must be passed under (different then jest.setTimeout).

// set new timeout for long running tests
jest.setTimeout(70000);

// test('Snohomish Scraper', async () => {

// 	let result = await snohomish.getParcelInfo('https://www.snoco.org/proptax/search.aspx?parcel_number=',
// 		'https://scopi.snoco.org/Html5Viewer/Index.html?configBase=https://scopi.snoco.org/Geocortex/Essentials/REST/sites/SCOPI/viewers/SCOPI/virtualdirectory/Resources/Config/Default' ,
// 		'00373301100301');

// 	// Parse the result to get the specific values I want to test for.
// 	let fetchedParcelNum = result['Basic']['PARCEL_NUM'];
// 	let fetchedYear = result['Building']['Year Built'];
// 	let fetchedLat = result['Location']['LAT'];

// 	expect(fetchedParcelNum).toMatch('00373301100301');
// 	expect(fetchedYear).toMatch('1969');
// 	expect(fetchedLat).toMatch('47.87232');
// });

// // test the lat/lon cleanup
// test('Lat/Lon raw to final value', () => {

// 	let latRaw = "48° 3' 50.72918' N";
// 	let lonRaw = "121° 54' 45.03040' W";

// 	expect(snohomish.CleanLatLon(latRaw, lonRaw)).toStrictEqual(['48.06409', '-121.91251'])
// })

// // test the lat/long degree to decimal converter
// test('Decimal Converter', () => {
// 	expect(snohomish.ConvertToDecimal(39, 25, 30.91)).toMatch('39.42525');
// })

// test('King County Scraper', async () => {

// 	let result = await king_county.getParcelInfo('https://blue.kingcounty.com/Assessor/eRealProperty/Dashboard.aspx?ParcelNbr=',
// 		'https://gismaps.kingcounty.gov/iMap/'
// 		, '3343301023');

// 	console.log(result);

// 	// Parse the result to get the specific values I want to test for.
// 	let fetchedParcelNum = result['Basic']['PARCEL_NUM'];
// 	let fetchedYear = result['Building']['Year Built'];
// 	let fetchedLat = result['Location']['LAT'];

// 	expect(fetchedParcelNum).toMatch('3343301023');
// 	expect(fetchedYear).toMatch('2016');
// 	expect(fetchedLat).toMatch('47.54411');
// });

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
	expect(fetchedAcres).toEqual('5.09');
	expect(fetchedSquareFeet).toEqual('1,440');
	expect(fetchedLat).toEqual('47.193147');
	//expect(fetchedSaleDate).toEqual('10/01/1999');
	expect(fetchedPicture).toEqual('https://atip.piercecountywa.gov/imageView?parcelNumber=0020262018&fileName=2020_PRI_1-7-2020_EZ_.jpg&imageType=Photos');
});