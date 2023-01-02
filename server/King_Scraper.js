// Scrape King County
// manually scrape parcel list and add to auction notes

const webdriver = require('selenium-webdriver');
const {By, until, Key} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const kingCountyParcelImagesURLBase = 'https://blue.kingcounty.com/Assessor/eRealProperty/pictures.aspx?ParcelNbr=';

// get info
const getParcelInfo = async function (baseUrl, parcelViewerURL, parcelNum) {

	let buildingTableIDs = ['#cphContent_DetailsViewPropTypeR', '#cphContent_DetailsViewPropTypeC', '#cphContent_DetailsViewPropTypeK'];

	// List of land tables IDs on the property detail page
	let landTableIds = ['#cphContent_DetailsViewLand', '#cphContent_DetailsViewLandSystem',  '#cphContent_DetailsViewLandViews', 
               '#cphContent_DetailsViewLandWaterfront', '#cphContent_DetailsViewLandDesignations', 
               '#cphContent_DetailsViewLandNuisances',
               '#cphContent_DetailsViewLandProblems', '#cphContent_DetailsViewLandEnviro']

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

			// Add the Parcel number and property info link
			currentParcel['Basic']['PARCEL_NUM'] = parcelNum;
			currentParcel['Basic']['PROPERTY_INFO_LINK'] = parcelURL;

			// get the rows from the first table of the parcel information page
	        let parcelTableRows = await driver.findElement(By.css('#container'))
	        							.findElement(By.css('#maincol'))
	        							.findElement(By.css('#contentcol'))
	        							.findElement(By.css('._table2'))
	        							.findElement(By.css('.GridViewStyle'))
	        							.findElement(By.tagName('tbody'))
	        							.findElements(By.tagName('tr'))

	        // loop through the first table of the parcel information page and add key value pairs to 'Basic' property.
	        for (const row of parcelTableRows) {

	        	let cells = await row.findElements(By.tagName('td'));

	        	let key = await cells[0].getAttribute('innerText');
	        	let value = await cells[1].getAttribute('innerText');

	        	currentParcel['Basic'][key] = value;
	        }


	        // handles errors due to noSuchElement for the different types of property tables
	        // GET BUILDING INFORMATION
	        // loop through buildingTableIDs list until building table is found
	        for (const buildingTableID of buildingTableIDs) {
	        	//console.log(buildingTableID);
		    	try {
		    		let buildingTableRows = await driver.findElement(By.css('#container'))
		    										.findElement(By.css('#maincol'))
		    										.findElement(By.css('#contentcol'))
		    										.findElement(By.css('._table2'))
		    										.findElement(By.css(buildingTableID))
		    										.findElement(By.tagName('tbody'))
		    										.findElements(By.tagName('tr'))

		    		// loop through the buildingTableRows and add key value pairs to 'Building' property.
		    		for (const row of buildingTableRows) {
		    			let cells = await row.findElements(By.tagName('td'));

		    			let key = await cells[0].getAttribute('innerText');
		    			let value = await cells[1].getAttribute('innerText');

		    			currentParcel['Building'][key] = value;
		    		}

		    		// if the above block was successful, buildingInfo has been found, now we won't check the other table names.
		    		break;

		    	} catch (error) {
		    		console.log(error.name);
		    	}
	    	}

	    	// Locate tax table
	    	try {
	    		let taxTableRows = await driver.findElement(By.css('#container'))
	    										.findElement(By.css('#maincol'))
	    										.findElement(By.css('#contentcol'))
	    										.findElement(By.css('._table2'))
	    										.findElement(By.css('#cphContent_GridViewDBTaxRoll'))
	    										.findElement(By.tagName('tbody'))
	    										.findElements(By.tagName('tr'))

	    		// grab only the first row from the tax table (skipping headers at index 0)
	    		let taxFirstRow = await taxTableRows[1].findElements(By.tagName('td'));

	    		// parse text values into integers for tax information
	    		let taxTotal = await taxFirstRow[taxFirstRow.length - 1].getAttribute('innerText');
	    		let taxLand = await taxFirstRow[taxFirstRow.length - 3].getAttribute('innerText');
	    		let taxBuilding = await taxFirstRow[taxFirstRow.length - 2].getAttribute('innerText');

	    		// Add tax info to current parcel object
	    		currentParcel['Tax']['TAXABLE_TOTAL'] = parseInt(taxTotal.replace(/[^0-9]/g, ""));
	    		currentParcel['Tax']['TAXABLE_LAND'] = parseInt(taxLand.replace(/[^0-9]/g, ""));		
	    		currentParcel['Tax']['TAXABLE_BUILDING'] = parseInt(taxBuilding.replace(/[^0-9]/g, ""));

	    	} catch (error) {
	    		console.log(error);
	    	}

    	// Get Land information
    	// parse acreage to float and assign to key 'Acres'
	    try {
		    // Find and click the property detail button
		    let propertyDetailLinkButton = await driver.findElement(By.css('#cphContent_LinkButtonDetail'));

		     	// instantiate actions
		 	const actions = driver.actions({async: true});

			// Click the property detail button then wait for it to load
		 	await actions.move({origin:propertyDetailLinkButton})
		 					.click()
		 					.pause(3000)
		 					.perform();

		 	await actions.clear();

		 	// Start by getting the base table that all the land tables are in
		 	let landTables = await driver.findElement(By.css('#container'))
                        .findElement(By.css('#maincol'))
                        .findElement(By.css('#TABLE1'))
                        .findElement(By.tagName('tbody'));

            // loop through the land table IDs
            for (const tableID of landTableIds) {
            	let currTable = await landTables.findElement(By.css(tableID)).findElement(By.tagName('tbody'));

            	let currTableRows = await currTable.findElements(By.tagName('tr'));

            	// loop through the current table's rows
            	for (const row of currTableRows) {
            		let cells = await row.findElements(By.tagName('td'));

            		let key = await cells[0].getAttribute('innerText');

            		let value = await cells[1].getAttribute('innerText');

            		// parse Acres from a string to a float
            		if (key == 'Acres') {
            			value = parseFloat(value);
            		}
            		currentParcel['Land'][key] = value;
            	}
            }

	 	} catch (error) {
	 		console.log(error);
	 	}

		// Try to get pictures
		try {
			let picturesPageURL = kingCountyParcelImagesURLBase+parcelNum;

			// navigate to pictures page
			await driver.get(picturesPageURL);

		 	// try to scrape pictures
		 	try{
			 	// get the table of pictures and each picture is a row
			 	let pictureRows = await driver.findElement(By.css('#cphContent_GridViewLandCurr'))
			 									.findElement(By.tagName('tbody'))
			 									.findElements(By.tagName('tr'));

			 	// initiate array to hold pictureURLs
			 	let pictureURLs = [];

			 	// skip the first row, extract the image URL from each pictureRow (.slice(1) takes everything after first row)
			 	for (const pictureRow of pictureRows.slice(1)) {
			 			// looping past the first row (headers)
			 			let pictureURL = await pictureRow.findElement(By.tagName('img')).getAttribute('src');
			 			pictureURLs.push(pictureURL);
			 	}

			 	// add pictures URL array to currentParcel
			 	currentParcel['Pictures'] = pictureURLs;
		 	} catch(error) {
		 		//trying again 
		 		console.log(error.name);
		 	}

		} catch(error) {
			console.log(error);
		}

		// try to get location!
		try {

			// navigate to parcel viewer above concatenated URL will already have selected URL highlighted
			await driver.get(parcelViewerURL);

			// build in delay
			 	// wait 5 seconds for full parcelViewerURL to load
 			await new Promise(resolve => setTimeout(resolve, 2000));

			// locate map element
			let gisMap = await driver.findElement(By.css('#map'));

			await new Promise(resolve => setTimeout(resolve, 2000));

			// locate search input box
			let searchInputBox = await gisMap.findElement(By.css('.search-node'))
											.findElement(By.css('.searchGroup'))
											.findElement(By.css('.searchInput'));

		     	// instantiate actions
		 	const actions = driver.actions({async: true});
			// enter parcel number into search input
			await actions.click(searchInputBox)
					.sendKeys("0")  // this is really dumb, seems like you have to pad the first sendKeys (doesn't actually send this propertly)
					.pause(1000)
					.sendKeys(String(parcelNum))
					.keyDown(Key.RETURN)
					.pause(2000)
					.perform();

			actions.clear();

			// try to click the results (if there are any)
			try {

				// click the map to get lat/lon
				let searchResultPoint = await gisMap.findElement(By.css('.esriPopup'))
													.findElement(By.css('.outerPointer'));

				// if the search was successful there will be a pop up, otherwise we can't find the lat/lon and assign nulls.
				if (await searchResultPoint.isDisplayed()) {

					// click the map near the results box (parcel that was searched). This activates the lat/lon display at the bottom of the map
					actions.move({origin:gisMap})
							.click()
							.pause(1000)
							.perform();

					actions.clear();

					// read the lat/lon
					let latLon = await gisMap.findElements(By.css('.coordinate-info'));

					let latLonText = await latLon[0].getAttribute('innerText');

					// split into lat and lon
					let latLonSplit = latLonText.split(" ");

					// assign lat/lon to current parcel
					currentParcel['Location']['LAT'] = latLonSplit[0];
					currentParcel['Location']['LON'] = latLonSplit[1];
				} else {
					// no pop up (parcel search was unsuccessful)
					currentParcel['Location']['LAT'] = null;
					currentParcel['Location']['LON'] = null;
				}
			} catch(error) {
				console.log(error);
				// error with search results on GIS map viewer
			}

		} catch(error) {
			// error with trying to get location
			console.log(error);
		}


    } catch(error) {
    	// error with parcel scrape
    	console.log(error.name);
    } finally {
    	// done scraping parcel
    	driver.quit();
    }

    return currentParcel;
}

module.exports = {getParcelInfo};