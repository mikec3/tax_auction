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

		// start with general information section
		let generalInformationRows = await driver.findElement(By.css('#mGeneralInformation'))
 										.findElements(By.tagName('tr'));

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

 		// loop through property char rows
 		for (row in propertyCharRows) {
 			let cells = await propertyCharRows[row].findElements(By.tagName('td'));

 			// key value pairs
 			let key = String(await cells[0].getAttribute('innerText'));
 			let value = String(await cells[1].getAttribute('innerText'));

 			// add property key value pairs
 			currentParcel['Land'][key] = value;
 		}

 		// Next get Tax info
 		let taxInfoRows = await driver.findElement(By.css('#mPropertyValues'))
 									.findElements(By.tagName('tr'));

 		// loop through tax rows
 		for (row in taxInfoRows) {
 				// skip the first row
	 			if (row >= 1) {
		 			let cells = await taxInfoRows[row].findElements(By.tagName('td'));


		 			// key value pairs
		 			let key = String(await cells[0].getAttribute('innerText'));
		 			let value = String(await cells[1].getAttribute('innerText'));

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

 	// get structure info link
 	let structureInfoLink = await propCells[propCells.length-1].findElement(By.tagName('a')).getAttribute('href');

 	// Navigate to the structure info page
 	await driver.get(structureInfoLink);

 	// Grab the second table on the page and get the rows
 	let structureInfoTables = await driver.findElements(By.tagName('table'))
 									
 	let structureInfoRows = await structureInfoTables[1].findElements(By.tagName('tr'));

 	//loop through the property structure info table rows
 	for (row in structureInfoRows) {
 		// skip the first row and the rest after 5, until row 10 below for the Floor Area info.
 		if(row >= 1 && row<=5) {
 			let cells = await structureInfoRows[row].findElements(By.tagName('td'));

 			let key = await cells[1].getAttribute('innerText');
 			let value = await cells[2].getAttribute('innerText');

 			currentParcel['Building'][key] = value;

 		} else if (row ==10) {
 			// process the floor area row
 			let cells = await structureInfoRows[row].findElements(By.tagName('td'));

 			// manually adding the floor area cells by index
 			currentParcel['Building'][await cells[1].getAttribute('innerText')] = await cells[2].getAttribute('innerText');
 			currentParcel['Building'][await cells[3].getAttribute('innerText')] = await cells[4].getAttribute('innerText');
 			currentParcel['Building'][await cells[5].getAttribute('innerText')] = await cells[6].getAttribute('innerText');
 			currentParcel['Building'][await cells[7].getAttribute('innerText')] = await cells[8].getAttribute('innerText');
 			currentParcel['Building'][await cells[9].getAttribute('innerText')] = await cells[10].getAttribute('innerText');

 		}
 	}

 	// Get picture!!!
 	let pictureTable = await driver.findElement(By.css('.attention')).findElement(By.tagName('img'));

 	// picture address
 	let pictureURL = await pictureTable.getAttribute('src');

 	// add picture url to current parcel
 	currentParcel['Building']['PROPERTY_PICTURE'] = pictureURL;

 	// GET LOCATION!!
 	// get pacel view map
 	await driver.get(parcelViewerURL);

 	// wait 5 seconds for full parcelViewerURL to load
 	await new Promise(resolve => setTimeout(resolve, 4000));

 	// instantiate actions
 	const actions = driver.actions({async: true});

 	//TODO add a try to the modalButton, sometimes the modal popup doesn't appear
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
 		console.log(e)
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
 		console.log(e);

 		 		// wait since it errored.
 		await new Promise(resolve => setTimeout(resolve, 1000));	
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
 	}

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

	latRaw = latRaw.replace(/\D/g,'');
	lonRaw = lonRaw.replace(/\D/g,'');

	// add decimal places and negative sign to the LON
	let LAT = latRaw.slice(0,2) + "." + latRaw.slice(2,latRaw.length)
	let LON = "-"+lonRaw.slice(0,3) + "." + lonRaw.slice(3,lonRaw.length)

	// add lat lon to parcel
	currentParcel['Location']['LAT'] = LAT;
	currentParcel['Location']['LON'] = LON;


	}
	finally {
		driver.quit();
	}

	return currentParcel;

}

module.exports = {getParcelInfo};

