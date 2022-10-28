// This file will read the auction notes to give auction info to the scrapers
const xlsx = require("xlsx");

// Auction Notes file patch
let filePath = 'Auction_Notes_2022.xlsx'

const workbook = xlsx.readFile(filePath);
const sheetNames = workbook.SheetNames;

// Get the data of "Sheet1"
const data = xlsx.utils.sheet_to_json(workbook.Sheets['AuctionNotes'])

console.log(data);

