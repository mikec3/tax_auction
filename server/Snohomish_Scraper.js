// This file will scrape the snohomish county list
// list needs to be supplied

//URL of 2022 list: https://www.snohomishcountywa.gov/DocumentCenter/View/100055/2022-Certificate-of-Delinquency-w-Exh-A?bidId=
//Manually scrape that pdf for parcel numbers

const webdriver = require('selenium-webdriver');
const {By, until, Key} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// TODO fix this so that it reads from an external file
const parcelNums = ['00373301100301', '00373301100305']

// Parcel Data URL
const parcelDataURL = 'https://snohomishcountywa.gov/5167/Assessor';

const parcelDataBaseURL = 'https://www.snoco.org/proptax/search.aspx?parcel_number='

const testURL = parcelDataBaseURL.concat(parcelNums[0]);

	// instantiate the driver
 	let driver = new webdriver.Builder()
 	    .forBrowser(webdriver.Browser.CHROME)
 	    .build();


// get info
const getParcelInfo = async function (url) {

	// instantiate empty object to hold this current parcel
	// basic properties are: Basic, Building, Tax, Location, Land
	let currentParcel = {};

	try {
		await driver.get(url);

		// start with general information section
		let generalInformationRows = await driver.findElement(By.css('#mGeneralInformation'))
 										.findElements(By.tagName('tr'));

 		// loop through the general information rows
 		for (row in generalInformationRows) {
 			let cells = await generalInformationRows[row].findElements(By.tagName('td'));

 			// key value pairs
 			let key = await cells[0].getAttribute('innerText');
 			let value = await cells[1].getAttribute('innerText');

 			console.log(key + " " + value);
 		}

 

	}
	finally {
		driver.quit();
	}

}

getParcelInfo(testURL);





