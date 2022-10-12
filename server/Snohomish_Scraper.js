// This file will scrape the snohomish county list
// list needs to be supplied

//URL of 2022 list: https://www.snohomishcountywa.gov/DocumentCenter/View/100055/2022-Certificate-of-Delinquency-w-Exh-A?bidId=
//Manually scrape that pdf for parcel numbers

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// TODO fix this so that it reads from an external file
const parcelNums = ['00373301100301', '00373301100305']

// Parcel Data URL
const parcelDataURL = 'https://www.google.com';


// async function

(async function scrape() {
// Open chrome driver
let driver = new webdriver.Builder()
    .forBrowser(webdriver.Browser.CHROME)
    .build();

// navigate to URL
await driver.get(parcelDataURL);



// Quit the driver
driver.quit()
})();