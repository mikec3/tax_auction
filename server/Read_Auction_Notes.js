// This file will read the auction notes to give auction info to the scrapers
const path = require('path');
const xlsx = require("xlsx");
const snohomish = require('./Snohomish_Scraper');

// console.log(__filename);
// console.log(__dirname);


const initialize = function () {
	let filePath = path.resolve(__dirname, 'Auction_Notes_2022.xlsx');

const workbook = xlsx.readFile(filePath);
const sheetNames = workbook.SheetNames;

// Get the data of "Sheet1"
const data = xlsx.utils.sheet_to_json(workbook.Sheets['AuctionNotes'])

console.log(data);
return data;
}

const doTest = function () {
	return snohomish.testFunc();
}

module.exports = {doTest, initialize};