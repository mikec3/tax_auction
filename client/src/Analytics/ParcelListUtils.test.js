import {countByCountyAndYear} from './ParcelListUtils'

test('countByCountyAndYear()', async () => {

    let parcelList = [{Meta: {AUCTION_DATE: '9/18/24', COUNTY: 'King'}, Tax: {TAXABLE_TOTAL: 10}},
        {Meta: {AUCTION_DATE: '9/18/24', COUNTY: 'King'}, Tax: {TAXABLE_TOTAL: 20}},
        {Meta: {AUCTION_DATE: '10/18/2024', COUNTY: 'Snohomish'}, Tax: {TAXABLE_TOTAL: 10}},
        {Meta: {AUCTION_DATE: '10/18/23', COUNTY: 'Snohomish'}, Tax: {TAXABLE_TOTAL: 10}}]

    let expectedResult = {
        King: {
            2024: {
                Count: 2,
                TAXABLE_TOTAL: 30
            }},
        Snohomish: {
            2024: {
                Count: 1,
                TAXABLE_TOTAL: 10
            },
            2023: {
                Count: 1,
                TAXABLE_TOTAL: 10
            }
        }
    }

    console.log(countByCountyAndYear(parcelList));
	expect(JSON.stringify(countByCountyAndYear(parcelList))).toMatch(JSON.stringify(expectedResult));
});