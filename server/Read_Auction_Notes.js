// This file will read the auction notes to give auction info to the scrapers
const path = require('path');
const xlsx = require("xlsx");

let file_location = 'Auction_Notes_2022.xlsx';

// console.log(__filename);
// console.log(__dirname);


const readAuctionNotes = function (sheetName) {
	let filePath = path.resolve(__dirname, file_location);

	const workbook = xlsx.readFile(filePath);
	//const sheetNames = workbook.SheetNames;

	// Get the data of "Sheet1"
	const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])

	//console.log(data);
	return data;
}


module.exports = {readAuctionNotes};