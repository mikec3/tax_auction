// This file will scrape the snohomish county list
// list needs to be supplied

//URL of 2022 list: https://www.snohomishcountywa.gov/DocumentCenter/View/100055/2022-Certificate-of-Delinquency-w-Exh-A?bidId=
//Manually scrape that pdf for parcel numbers

const webdriver = require('selenium-webdriver');
const {By, until, Key} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// get info
const getParcelInfo = async function (baseUrl, parcelViewerURL, parcelNum) {

	// create parcel url
	let parcelURL = baseUrl.concat(parcelNum);

		// instantiate the driver
 	let driver = new webdriver.Builder()
 	    .forBrowser(webdriver.Browser.CHROME)
 	    .build();

	// instantiate empty object to hold this current parcel
	let currentParcel = {
		'Basic' : {},
		'Building' : {},
		'Tax' : {},
		'Location' : {},
		'Land' : {}

	};

	try {
		await driver.get(parcelURL);
		console.log(parcelURL);

		// Add the Parcel number and property info link
		currentParcel['Basic']['PARCEL_NUM'] = parcelNum;
		currentParcel['Basic']['PROPERTY_INFO_LINK'] = parcelURL;

			 		// wait 2 seconds for full parcel info page to load
	 	await new Promise(resolve => setTimeout(resolve, 2000));

		// start with general information section
		let generalInformationRows = await driver.findElement(By.css('#mGeneralInformation'))
 										.findElements(By.tagName('tr'));

 		console.log(generalInformationRows);

 		// loop through the general information rows
 		for (row in generalInformationRows) {
 			let cells = await generalInformationRows[row].findElements(By.tagName('td'));

 			// key value pairs
 			let key = String(await cells[0].getAttribute('innerText'));
 			let value = String(await cells[1].getAttribute('innerText'));

 			// Add key value pairs to Basic info of current parcel
 			currentParcel['Basic'][key] = value;

 		}

 		// Next get land information
 		let propertyCharRows = await driver.findElement(By.css('#mPropertyCharacteristics'))
 									.findElements(By.tagName('tr'));

 		// property rows have 'Size (gross)': "0.2" & 'Unit of Measure': "Acre(s)"
 		// store only 'Acres': floatNumber - other scrapers will match this formatting for easy ingestion by client.
 		//
 		// loop through property char rows
 		for (row in propertyCharRows) {
 			let cells = await propertyCharRows[row].findElements(By.tagName('td'));

 			// key value pairs
 			let key = String(await cells[0].getAttribute('innerText'));
 			let value = String(await cells[1].getAttribute('innerText'));

 			// if we're on the size row, save the value as a decimal number and call it 'Acres'.
 			if (key == 'Size (gross)') {
 				currentParcel['Land']['Acres'] = parseFloat(value);
 			} else {
 				// add property key value pairs
 				currentParcel['Land'][key] = value;
 			}
 		}

 		// Next get Tax info
 		let taxInfoRows = await driver.findElement(By.css('#mPropertyValues'))
 									.findElements(By.tagName('tr'));

 		// Store values as numbers - scraped values are "$100,000".
 		// loop through tax rows
 		for (row in taxInfoRows) {
 				// skip the first row
	 			if (row >= 1) {
		 			let cells = await taxInfoRows[row].findElements(By.tagName('td'));


		 			// key value pairs
		 			let key = String(await cells[0].getAttribute('innerText'));
		 			let value = String(await cells[1].getAttribute('innerText'));

		 			// store tax values as integers (strips the $ and commas from string)
		 			value = parseInt(value.replace(/[^0-9]/g, ""));

		 			// only add certain tax rows and cells
		 			switch(key) {
		 				case 'Taxable Value Regular':
		 					currentParcel['Tax']['TAXABLE_TOTAL'] = value;
		 					break;
		 				case 'Market Land':
		 					currentParcel['Tax']['TAXABLE_LAND'] = value;
		 					break;
		 				case 'Market Improvement':
		 					currentParcel['Tax']['TAXABLE_BUILDING'] = value;
		 					break;
		 				default:
		 					break;
		 			}
	 		}
 		}

 	// next get building information. There can be more than one building info row, but to simplify, I'm only grabbing the first one.
 	// first get the building table
 	let buildingInfoRows = await driver.findElement(By.css('#mRealPropertyStructures')).findElements(By.tagName('tr'));

 	// grab just the first row for now, may expand to grab secondary structures
 	let propCells = await buildingInfoRows[1].findElements(By.tagName('td'));

 	console.log('Get Structure Info');

 	// for structure info data, use class names 'noteblue' and 'emphless' for key:values

 	try {
	 	// get structure info link
	 	let structureInfoLink = await propCells[propCells.length-1].findElement(By.tagName('a')).getAttribute('href');

	 	// Navigate to the structure info page
	 	await driver.get(structureInfoLink);

	 	// Grab the second table on the page and get the rows
	 	let pageTables = await driver.findElements(By.tagName('table'))
	 	// Second table is the one with all the goodies (key value pairs of information 'noteblue':'emphless')							
	 	let structureInfoTable = await pageTables[1]

	 	// get all keys 'noteblue' class (These are the keys on the page).
	 	let keys = await structureInfoTable.findElements(By.css('.noteblue'));
	 	// values on the page : 'emphtext' is the parcel number (first row), rest are 'emphless'. So I get all the emphless,
	 	// then add (unshift) the emphtext to the first position of the array
	 	let values = await structureInfoTable.findElements(By.css('.emphless'));
	 	values.unshift(await structureInfoTable.findElement(By.css('.emphtext')));

	 	// loop through key value arrays and assign to currentParcel
	 	for (let x = 0; x<= keys.length; x++) {

	 		try{
		 		let key = await keys[x].getAttribute('innerText');
		 		let value = await values[x].getAttribute('innerText');

		 		currentParcel['Building'][key] = value;

		 		//console.log(key + " : " + value);
	 		} catch {
	 			console.log('missing key or value pair');
	 		}
	 	}


	 	// Get picture!!!
	 	let pictureTable = await driver.findElement(By.css('.attention')).findElement(By.tagName('img'));

	 	// picture address
	 	let pictureURL = await pictureTable.getAttribute('src');

	 	// add picture url to current parcel - add it as an array element because other scrapers sometimes have more than 1 picture in an array
	 	currentParcel['Pictures'] = [pictureURL];
 	} catch (error) {
 		console.log(error);
 		console.log('No structure info link');
 	}

 	// GET LOCATION!!
 	// get pacel view map
 	await driver.get(parcelViewerURL);

 	// wait 5 seconds for full parcelViewerURL to load
 	await new Promise(resolve => setTimeout(resolve, 4000));

 	// instantiate actions
 	const actions = driver.actions({async: true});

 	// Added a try to the modalButton, sometimes the modal popup doesn't appear
 	try {
	 	// grab button on popup modal - 'I agree'
	 	let modalButton = await driver.findElement(By.css('.ModalViewContainerView'))
	 								.findElement(By.tagName('form'))
	 								.findElement(By.css('.form-btns'))
	 								.findElement(By.tagName('button'))

	 	// click the 'I agree' modal button
	 	await actions.move({origin:modalButton}).click().perform();

	 	 	// clear actions
 		await actions.clear();

 	} catch (e) {
 		console.log('Parcel viewer modal didnt show up');
 	}

 	// get parcel search button
 	let parcelSearchButton = await driver.findElement(By.css('.toolbar-group')).findElement(By.tagName('button'));

 	// press the parcel search button
 	await actions.move({origin:parcelSearchButton}).click().pause(500).perform();

 	await actions.clear();

 	try {
	 	// get parcel search input
	 	let parcelSearchInput = await driver.findElement(By.css('.workflow-container-region-holder')).findElement(By.tagName('input'));
	 	
	 	// enter parcel number into search box and hit enter
	 	await actions.move({origin:parcelSearchInput})
	 					.click()
	 					.sendKeys(parcelNum)
	 					.sendKeys(Key.RETURN)
	 					.pause(3000)
	 					.perform();

	 	await actions.clear();

 	} catch (e) {
 		console.log('Probably couldnt find the parcel search input.');
 	} 

 	//try catch in case the parcel isn't found
 	try {
	 	// get lat long now that parcel has been searched
	 	// get the active map element
	 	let mapElement = await driver.findElement(By.css('#map-container'));

	 	// click the map element to activate the lat/lon box
	 	await actions.move({origin:mapElement})
	 					.contextClick()
	 					.pause(3000)
	 					.perform();

	 		// wait 5 seconds for full parcelViewerURL to load
	 	await new Promise(resolve => setTimeout(resolve, 1000));

	 	await actions.clear();

	 	// get lat long element
	 	let latLonElement = await driver.findElement(By.css('.region-active'))
									 	.findElement(By.css('.map-menu-coordinates'))
									 	.findElements(By.tagName('span'));

		// get the lat lon strings and strip all non numeric characters
		let latRaw = await latLonElement[0].getAttribute('innerText');
		let lonRaw = await latLonElement[1].getAttribute('innerText');

		// strip all the special characters
		// some lat/lon have decimals in the seconds that need to be retained...
		// latRaw = latRaw.replace(/\D/g,'');
		// lonRaw = lonRaw.replace(/\D/g,'');

		// //  convert lat/lon minutes to decimal
		// latRaw = ConvertToDecimal(latRaw.slice(0,2), latRaw.slice(2,4), latRaw.slice(4,6));
		// lonRaw = ConvertToDecimal(lonRaw.slice(0,3), lonRaw.slice(3,5), lonRaw.slice(5,7));

		// Convert the lat/lon strings with special characters from degrees to decimal coordinates
		let LAT = CleanLatLon(latRaw, lonRaw)[0];
		let LON = CleanLatLon(latRaw, lonRaw)[1];

		// add lat lon to parcel
		currentParcel['Location']['LAT'] = LAT;
		currentParcel['Location']['LON'] = LON;
	} catch (error) {
		console.log('parcel probably wasnt found on viewer');
	}

	}
	finally {
		driver.quit();
	}

	return currentParcel;

}

// Cleans the raw lat/lon from the website into database values
const CleanLatLon = function (latRaw, lonRaw) {

	// split lat into chunks of degrees, minutes, seconds, then remove special characters
	let latSplit = latRaw.split(/ /);
	let lonSplit = lonRaw.split(/ /);

	// loop through each element of the latSplit and remove special characters
	let latNum = latSplit.map((e) => {
		return e.replace(/[°'"]/,'');
	})

	// loop through each element of the lonSplit and remove special characters
	let lonNum = lonSplit.map((e) => {
		return e.replace(/[°'"]/,'');
	})

	// convert the degrees, minutes, seconds of lat/lon into decimals
	let lat = ConvertToDecimal(latNum[0], latNum[1], latNum[2]);
	let lon = ConvertToDecimal(lonNum[0], lonNum[1], lonNum[2]);

	// add negative sign to the lon
	lon = "-" + lon;

	// return results as an array of [latitude, longitude]
	return [lat,lon];
}

// converts lat/lon minutes/seconds to decimal
// Decimal degrees = Degrees + (Minutes/60) + (Seconds/3600)
const ConvertToDecimal = function (degrees, minutes, seconds) {

	degrees = parseInt(degrees);
	minutes = parseInt(minutes);
	seconds = parseFloat(seconds);

	// round the result
	let decimals = (degrees + (minutes/60) + (seconds/3600)).toFixed(5);

	return String(decimals);
}

module.exports = {getParcelInfo, CleanLatLon, ConvertToDecimal};

