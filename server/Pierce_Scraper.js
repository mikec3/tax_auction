// Scrape Pierce County
// manually scrape parcel list and add to auction notes

const webdriver = require('selenium-webdriver');
const {By, until, Key} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

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
		'Land' : {}

	};

		// Add the Parcel number and property info link
	currentParcel['Basic']['PARCEL_NUM'] = parcelNum;
	currentParcel['Basic']['PROPERTY_INFO_LINK'] = parcelURL.concat('/summary');

	// get basic info
	try {
			await driver.get(parcelURL.concat('/summary'));

			// scrape all ux-data-display-table classes and sort out which elements to add
			let dataDisplayTables = await driver.findElements(By.css('.ux-data-display-table'));

			// let dataDisplayRows = await dataDisplayTables[0].findElements(By.tagName('tr'));

			// let text = await dataDisplayRows[0].getAttribute('innerText');

			// let cells = await dataDisplayRows[0].findElements(By.tagName('td'));

			// let cellKey = await cells[0].getAttribute('innerText');

			// let cellValue = await cells[1].getAttribute('innerText');

			// iterate through tables
			for (let table of dataDisplayTables) {
				// get the rows in the table
				let rows = await table.findElements(By.tagName('tr'));

				// iterate through each row
				for (let row of rows) {
					let cells = await row.findElements(By.tagName('td'));

					// get key and values
					let cellKey = await cells[0].getAttribute('innerText');

					let cellValue = await cells[1].getAttribute('innerText');
					console.log('cellKey: ' + cellKey);
					console.log('cellValue: ' + cellValue);
				}
			}

	} catch (error) {
		console.log('get summary info failed');
		console.log(error);
	}

	return currentParcel;
}

module.exports = {getParcelInfo};