// Scrape Pierce County
// manually scrape parcel list and add to auction notes

// TODO re-scrape and fix the following
// tax : Fix tax scraper error

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

			await driver.get(parcelURL.concat('/summary'));
			await new Promise(resolve => setTimeout(resolve, pauseTime));
			console.log('finding summary info');

			//scrape all ux-data-display-table classes and sort out which elements to add
			let dataDisplayTables = await driver.findElements(By.css('.ux-data-display-table'));

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
					//console.log(cellKey + ": " + cellValue);

					// add table data into parcelInfo as key-value pairs
					currentParcel['Basic'][cellKey] = cellValue;
				}
			}

			// go to taxes page
			await driver.get(parcelURL.concat('/taxes'));
			console.log('finding tax information');

						// build in delay
			 	// wait 5 seconds for full parcelViewerURL to load
 			await new Promise(resolve => setTimeout(resolve, pauseTime+1500));

						// scrape all ux-data-display-table classes and sort out which elements to add
			dataDisplayTables = await driver.findElements(By.css('.ux-data-display-table'));


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
						//console.log(cellKey + ": " + cellValue);
											
						// add table data into parcelInfo as key-value pairs
						currentParcel['Tax'][cellKey] = cellValue;

						// add the needed fields
						if (cellKey == 'Assessed Total') {
							// convert cellValue to number and add as 'TAXABLE_TOTAL'
							currentParcel['Tax']['TAXABLE_TOTAL'] = parseInt(cellValue.replace(',', ''));
						}

						if (cellKey == 'Assessed Improvements') {
							currentParcel['Tax']['TAXABLE_BUILDING'] = parseInt(cellValue.replace(',', ''));
						}

						if (cellKey == 'Assessed Land') {
							currentParcel['Tax']['TAXABLE_LAND'] = parseInt(cellValue.replace(',', ''));
						}
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
						//console.log(cellKey + ": " + cellValue);

						// add table data into parcelInfo as key-value pairs
						currentParcel['Land'][cellKey] = cellValue;

						// store 'Acres' as a float not a string
						if (cellKey == 'Acres') {
							currentParcel['Land']['Acres'] = parseFloat(cellValue.replace(',',''));
						}
					}
				}
			} catch (error) {
				console.log('error looping through land tables');
				console.log(error);
			}

			// try to get building info
			try {
							// go to land page
				await driver.get(parcelURL.concat('/building'));

										// build in delay
				 	// wait 5 seconds for full parcelViewerURL to load
	 			await new Promise(resolve => setTimeout(resolve, pauseTime+2000));

	 			
				console.log('finding building information');

							// scrape all ux-data-display-table classes and sort out which elements to add
				let dataTable = await driver.findElement(By.css('.container-fluid'));

				let dataBlock = await dataTable.findElement(By.css('.row'));

				let dataRows = await dataBlock.findElements(By.css('.row'));

			} catch (error) {
				console.log('error looping through building page');
				console.log(error);
			}

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
						currentParcel['Building'][cellKey] = cellValue;
					
				}
			} catch (error) {
				console.log('error looping through building tables');
				console.log(error);
			}

			// try looping through the second building table
			try {

				let dataTables = await driver.findElements(By.css('.panel.panel-info'));

				let dataTable2 = await dataTables[2].findElement(By.css('.panel-body'));

				let tableHeaders = await dataTable2.findElements(By.tagName('th'));

				let tableData = await dataTable2.findElements(By.tagName('td'));

				for (let x = 0; x < tableHeaders.length; x++) {
					let cellKey = await tableHeaders[x].getAttribute('innerText');
					let cellValue = await tableData[x].getAttribute('innerText');
					currentParcel['Building'][cellKey] = cellValue;
				}


				// diagnostics
				let panelText = await dataTable2.getAttribute('innerText');

				//console.log(panelText);

				//console.log(await tableHeaders[0].getAttribute('innerText'));

				//console.log(await tableData[0].getAttribute('innerText'));



			} catch (error) {
				console.log('problem looping through second building table');
				console.log(error);
			}

						// go to land page
			await driver.get(parcelURL.concat('/photos'));

			console.log('finding picture urls');

									// build in delay
			 	// wait 5 seconds for full parcelViewerURL to load
 			await new Promise(resolve => setTimeout(resolve, pauseTime+2000));

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
 				//console.log(imageURL);
 			}

 			currentParcel['Pictures'] = parcelImageURLs;


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
 			await new Promise(resolve => setTimeout(resolve, pauseTime+2000));

 			// try to close the warning modal
 		try {


			//
//<button class="jimu-btn app-root-emotion-cache-ltr-czrfzi icon-btn btn btn-primary" style="font-size: 16px;"><span class="icon-btn-sizer">OK</span></button>


			//
			//let splashContainerButton = await driver.findElement(By.css('.jimu-btn.jimu-float-trailing.enable-btn.lastFocusNode'));
			let splashContainerButton = await driver.findElement(By.css('.modal-content')).findElement(By.tagName('button'));
			let splashContainerText = await splashContainerButton.getAttribute('innerText');
			//console.log(splashContainerText);

			 				     	// instantiate actions
		 	const actions = driver.actions({async: true});
			// enter parcel number into search input
			await actions.click(splashContainerButton)
					.keyDown(Key.RETURN)
					.pause(1000)
					.perform();

			actions.clear();

		} catch (e) {
			console.log('Failed trying to close the GIS map page opening modal');
			console.log(e);
		}

		try {

			// click coordiantes info box first to activate it, then click the map to populate it with coordinates
			let infoBox = await driver.findElement(By.css('.scroll-list-root')).findElement(By.tagName('button'));

			// instantiate actions
			const actions = driver.actions({async: true});
					// click the map near the results box (parcel that was searched). This activates the lat/lon display at the bottom of the map
			actions.move({origin:infoBox})
					.click()
					.pause(500)
					.perform();

			actions.clear();

			// click the map element to populate the coordinates info box
			let mapElement = driver.findElement(By.css('.arcgis-map'));

			actions.move({origin:mapElement})
			.click()
			.pause(500)
			.perform();

			actions.clear();

			// let mapElement = await driver.findElement(By.css('#map'));


			// 	// instantiate actions
			// const actions = driver.actions({async: true});
			// 		// click the map near the results box (parcel that was searched). This activates the lat/lon display at the bottom of the map
			// actions.move({origin:mapElement})
			// 		.click()
			// 		.pause(500)
			// 		.perform();

			// actions.clear();

			// let infoBox = await driver.findElement(By.css('#dijit__WidgetBase_2'));

			// actions.move({origin:infoBox})
			// 		.click()
			// 		.pause(500)
			// 		.perform();

			// actions.clear();

			// // // wait after clicking coordinate info box
	 		// await new Promise(resolve => setTimeout(resolve, pauseTime));

	 		// console.log('paused after clicking map');

			// try to find using classes
			// let coordinateInfoByClass = await driver.findElements(By.css('.jimu-widget-cc.outputCoordinateContainer'));

			// let textFromInfoBox = await coordinateInfoByClass.getAttribute('innerText');
			// console.log(textFromInfoBox);

			// let coordinateInfoTextBox = await coordinateInfoByClass[3].findElement(By.css('.ta'));

			// let coordinateTextRaw = await coordinateInfoTextBox.getAttribute('value');

			// wait after clicking coordinate info box
	 		await new Promise(resolve => setTimeout(resolve, pauseTime));

			let coordinateInfo = await driver.findElement(By.css('#coordDD'));

			let coordinateTextRaw = await coordinateInfo.getAttribute('value');

			//console.log('coordinate value' + coordinateTextValue);

			let coordinateText = StripLatLon(coordinateTextRaw);

			currentParcel['Location']['LAT'] = coordinateText[0];
			currentParcel['Location']['LON'] = coordinateText[1];


		} catch (error) {
			console.log('problem selecting the map and info box for lat/lon, trying again');
			console.log(error);

			try {
				console.log('if you see this message, I should have made a backup if the first lat/lon attempt failed');

			} catch (error) {
				console.log(error);
				console.log('failed twice to select the map and info box for lat/lon');
			}

		}


	} catch (error) {
		console.log(error);
		console.log('problem finding lat/lon')
		driver.close();
	}

 	driver.close();
	return currentParcel;
}

// takes a single text element '+47.193184N -122.777412W' and returns a two element array of ['47.193184', '-122.777412']
const StripLatLon = function (coordinates) {

	// split by space character into two array elements
	let latLonArray = coordinates.split(" ");

	//replace everything but numbers decimals and negative signs
	latLonArray[0] = latLonArray[0].replace(/[^0-9.-]/g,"");
	latLonArray[1] = latLonArray[1].replace(/[^0-9.-]/g,"");


	console.log(latLonArray);

	return latLonArray;
}

module.exports = {getParcelInfo, StripLatLon};