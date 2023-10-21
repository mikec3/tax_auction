// Scrape Pierce County
// manually scrape parcel list and add to auction notes

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
	currentParcel['Basic']['PROPERTY_INFO_LINK'] = parcelURL.concat('/summary');

	// get basic info
	try {

		// create empty parcelInfo object to hold key-value pairs
		parcelInfo = {};

			await driver.get(parcelURL.concat('/summary'));
			console.log('finding summary info');

			//scrape all ux-data-display-table classes and sort out which elements to add
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
					console.log(cellKey + ": " + cellValue);

					// add table data into parcelInfo as key-value pairs
					parcelInfo[cellKey] = cellValue;
				}
			}

			// go to taxes page
			await driver.get(parcelURL.concat('/taxes'));
			console.log('finding tax information');

						// build in delay
			 	// wait 5 seconds for full parcelViewerURL to load
 			await new Promise(resolve => setTimeout(resolve, pauseTime+1000));

						// scrape all ux-data-display-table classes and sort out which elements to add
			dataDisplayTables = await driver.findElements(By.css('.ux-data-display-table'));
			// console.log(dataDisplayTables);
			// //console.log(await dataDisplayTables[0].getAttribute('innerText'));

			// let dataDisplayRows = await dataDisplayTables[0].findElements(By.tagName('tr'));

			// let text = await dataDisplayRows[0].getAttribute('innerText');

			// let cells = await dataDisplayRows[0].findElements(By.tagName('td'));

			// let cellKey = await cells[0].getAttribute('innerText');

			// let cellValue = await cells[1].getAttribute('innerText');

			// console.log(text);
			// console.log(cellKey);
			// console.log(cellValue);


			// try to loop through tables
			try {
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
						console.log(cellKey + ": " + cellValue);
											
						// add table data into parcelInfo as key-value pairs
						parcelInfo[cellKey] = cellValue;
					}
				}
			} catch (error) {
				console.log('error looping through tax tables');
				console.log(error);
			}

						// go to land page
			await driver.get(parcelURL.concat('/land'));

									// build in delay
			 	// wait 5 seconds for full parcelViewerURL to load
 			await new Promise(resolve => setTimeout(resolve, pauseTime));


			console.log('finding land information');

						// scrape all ux-data-display-table classes and sort out which elements to add
			dataDisplayTables = await driver.findElements(By.css('.ux-data-display-table'));

			let dataDisplayRows = await dataDisplayTables[0].findElements(By.tagName('tr'));

			let text = await dataDisplayRows[0].getAttribute('innerText');

			let cells = await dataDisplayRows[0].findElements(By.tagName('td'));

			let cellKey = await cells[0].getAttribute('innerText');

			let cellValue = await cells[1].getAttribute('innerText');

			console.log(text);
			console.log(cellKey + " " + cellValue);

			// try looping through land tables
			try {
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
						console.log(cellKey + ": " + cellValue);

						// add table data into parcelInfo as key-value pairs
						parcelInfo[cellKey] = cellValue;
					}
				}
			} catch (error) {
				console.log('error looping through land tables');
				console.log(error);
			}

						// go to land page
			await driver.get(parcelURL.concat('/building'));

									// build in delay
			 	// wait 5 seconds for full parcelViewerURL to load
 			await new Promise(resolve => setTimeout(resolve, pauseTime));

 			
			console.log('finding building information');

						// scrape all ux-data-display-table classes and sort out which elements to add
			let dataTable = await driver.findElement(By.css('.container-fluid'));

			let dataBlock = await dataTable.findElement(By.css('.row'));

			let dataRows = await dataBlock.findElements(By.css('.row'));

			//text = await dataRow.getAttribute('innerText');

			//console.log(text);

			// try looping through building rows
			try {
				// iterate through the rows
				for (let row of dataRows) {
					// get the rows in the table
					let cells = await row.findElements(By.tagName('div'));

					// get key and values
						let cellKey = await cells[0].getAttribute('innerText');

						let cellValue = await cells[1].getAttribute('innerText');

						// add table data into parcelInfo as key-value pairs
						parcelInfo[cellKey] = cellValue;
					
				}
			} catch (error) {
				console.log('error looping through building tables');
				console.log(error);
			}

						// go to land page
			await driver.get(parcelURL.concat('/photos'));

			console.log('finding picture urls');

									// build in delay
			 	// wait 5 seconds for full parcelViewerURL to load
 			await new Promise(resolve => setTimeout(resolve, pauseTime));

 			// Get table of picture URLs
 			let imagePanel = await driver.findElement(By.css('.panel-body.grid-images'));
 			//console.log(imagePanel);

 			// get image elements
 			let images = await imagePanel.findElements(By.tagName('img'));

 			// loop through images
 			parcelImageURLs = [];
 			for (let image of images) {
 				let imageURL = await image.getAttribute('src');
 				parcelImageURLs.push(imageURL);
 				console.log(imageURL);
 			}

 			parcelInfo['Pictures'] = parcelImageURLs;
			console.log(parcelInfo);


	} catch (error) {
		console.log('get parcel info failed');
		console.log(error);
		driver.close();
	}

	// try to get Lat/Lon
	try {
		await driver.get(parcelViewerURL.concat(parcelNum));


									// build in delay
			 	// wait 5 seconds for full parcelViewerURL to load
 			await new Promise(resolve => setTimeout(resolve, pauseTime+3000));

 			// try to close the warning modal
 		try {
			let splashContainerButton = await driver.findElement(By.css('.jimu-btn.jimu-float-trailing.enable-btn.lastFocusNode'));
			let splashContainerText = await splashContainerButton.getAttribute('innerText');
			console.log(splashContainerText);

			 				     	// instantiate actions
		 	const actions = driver.actions({async: true});
			// enter parcel number into search input
			await actions.click(splashContainerButton)
					.keyDown(Key.RETURN)
					.pause(2000)
					.perform();

			actions.clear();

		} catch (e) {
			console.log('Failed trying to close the GIS map page opening modal');
			console.log(e);
		}

		let mapElement = await driver.findElement(By.css('#map'));


			// instantiate actions
		const actions = driver.actions({async: true});
				// click the map near the results box (parcel that was searched). This activates the lat/lon display at the bottom of the map
		actions.move({origin:mapElement})
				.contextClick()
				.pause(1000)
				.perform();

		let coordinateInfo = await driver.findElement(By.css('.coordinate-info.jimu-float-leading.jimu-align-leading'));

		let coordinateText = await coordinateInfo.getAttribute('innerText');

		console.log(coordinateText);


 											



	} catch (error) {
		console.log(error);
		console.log('problem finding lat/lon')
		driver.close();
	}

 	driver.close();
	return currentParcel;
}

module.exports = {getParcelInfo};