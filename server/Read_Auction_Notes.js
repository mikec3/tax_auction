// This file will read the auction notes to give auction info to the scrapers
const path = require('path');
//const xlsx = require("xlsx");
const fs = require('fs');
const Papa = require('papaparse');

//let file_location = 'Auction_Notes_2022.xlsx';

// console.log(__filename);
// console.log(__dirname);


const readAuctionNotes = async function (file_location, sheetName) {
	let filePath = path.resolve(__dirname, file_location+sheetName+'.txt');

  const csvFile = fs.readFileSync(filePath)
  const csvData = csvFile.toString()  
  return new Promise(resolve => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        console.log('Complete', results.data.length, 'records.'); 
        //console.log(results.data);
        resolve(results.data);
      }
    });
  });




	//console.log(data);
	return data;
}


module.exports = {readAuctionNotes};