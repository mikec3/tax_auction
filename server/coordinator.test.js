// TEST Read_Auction_Notes coordinator file
const snohomish = require('./Snohomish_Scraper');
const coordinator = require('./Read_Auction_Notes');

console.log(__dirname);
console.log('helllooooooo');

test('Retrieve url from test function', () => {
  expect(coordinator.doTest()).toMatch("https://snohomishcountywa.gov/5167/Assessor");
});
