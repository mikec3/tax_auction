// This file will read the auction notes to give auction info to the scrapers

const readXlsxFile = require('read-excel-file/node');

// Auction Notes file patch
let filePath = 'Auction_Notes_2022.xlsx'

const map = {
  'COUNTY': 'COUNTY',
  'AUCTION_DATE': 'AUCTION_DATE',
  'AUCTION_INFO_URL': 'AUCTION_INFO_URL',
  'PARCEL_INFO_URL': 'PARCEL_INFO_URL',
  'AUCTION_SITE': 'AUCTION_SITE'
}


const ReadData = async function () {

let data = [];
// Read excel file
readXlsxFile(filePath, {map, sheet:'AuctionNotes'}).then((rows) => {
  // `rows` is an array of rows
  // each row being an array of cells.
  data = rows;
});

return await data;
}

let data = ReadData();
console.log(data);

