const webdriver = require('selenium-webdriver');
const {By, until, Key} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

let pauseTime = 2000;

// get info
const getParcelInfo = async function (baseUrl, parcelViewerURL, parcelNum) {

	// instantiate the driver
 	let driver = await new webdriver.Builder()
 	    .forBrowser('chrome')
 	    .build();

 		// create parcel url
	let parcelURL = baseUrl.concat(parcelNum);

		// instantiate empty object to hold this current parcel
	let currentParcel = {
		'Basic' : {},
		'Building' : {},
		'Tax' : {},
		'Location' : {},
		'Land' : {},
		'Pictures': {}

	};

		// Add the Parcel number and property info link
	currentParcel['Basic']['PARCEL_NUM'] = parcelNum;
	currentParcel['Basic']['PROPERTY_INFO_LINK'] = parcelURL;

	// try to get basic info
	try{

		await driver.get(parcelURL);

		//grab the first element with class 'emphatic' (info table header), then go up to it's parent table, then grab all rows
		let tableHeader = await driver.findElement(By.css('.emphatic'));
		let basicInfoTable = await tableHeader.findElement(By.xpath('../../..'));  // go up to parent table
		let basicInfoRows = await basicInfoTable.findElements(By.tagName('tr'));   // get rows of data, each row as a header td and value td

		// loop through basic info rows
		for (let row of basicInfoRows) {
			let cells = await row.findElements(By.tagName('td'));

			let key = await cells[0].getAttribute('innerText');
			let value = await cells[1].getAttribute('innerText');

			// strip the ':' from the key names
			key = key.replace(/[:]/g,"");

			// check for items I want to change the name of
			if (key == 'Situs Address') {
				key = 'Site Address';
			}

			currentParcel['Basic'][key] = value;

			//console.log(key + ' ' + value);
		}

	}
	catch(error) {
		console.log('error finding basic info');
		console.log(error);
	}

	// try to get building information
	try {
		// create building URL
		let buildingURL = parcelURL.replace('basic', 'struct');

		await driver.get(buildingURL);

		// grab the first element with class 'emphatic' then go up to it's parent, then grab all rows
		let tableFirstRow = await driver.findElement(By.css('.emphatic'));
		let structInfoTable = await tableFirstRow.findElement(By.xpath('../..'));
		let structInfoRows = await structInfoTable.findElements(By.tagName('tr'));

		// loop through each row of the structure info table
		for (let row of structInfoRows) {
			let cells = await row.findElements(By.tagName('td'));

			// if table row has 2 or more table data cells, then create the key value pairs
			if (cells.length >= 2) {

				let key = await cells[0].getAttribute('innerText');
				let value = await cells[1].getAttribute('innerText');

				// check to make sure key is not empty before loading
				if (key.length > 2) {

					// square footage check
					if (key == 'Main Finished Area') {
						key = 'Square Feet';
					}
					// add building info to current parcel
					currentParcel['Building'][key] = value;
				}
			}
		}
	} catch (error) {
		console.log('error finding building info');
		console.log(error);
	}

	// get land info
	try {
		// create land url
		let landURL = parcelURL.replace('basic', 'land');

		await driver.get(landURL);

				// grab the first element with class 'emphatic' then go up to it's parent, then grab all rows
		let tableFirstRow = await driver.findElement(By.css('.emphatic'));
		let landInfoTable = await tableFirstRow.findElement(By.xpath('../..'));
		let landInfoRows = await landInfoTable.findElements(By.tagName('tr'));

		// loop through each row of the land info table
		for (let row of landInfoRows) {
			let cells = await row.findElements(By.tagName('td'));

			// if table row has 2 or more table data cells, then create the key value pairs
			if (cells.length >= 2) {

				let key = await cells[1].getAttribute('innerText');
				let value = await cells[2].getAttribute('innerText');

				// check to make sure key is not empty before loading
				if (key.length > 2) {

					// square footage check
					if (key == 'Lot Acreage') {
						key = 'Acres';
						value = parseFloat(value);
					}
					// add building info to current parcel
					currentParcel['Land'][key] = value;
				}
			}
		}

	} catch (error) {
		console.log('error finding land info');
		console.log(error);
	}

	// get tax info
	try {



		

	} catch (error) {
		console.log('error finding tax info');
		console.log(error);
	}


 	driver.close();
	return currentParcel;
}

module.exports = {getParcelInfo};