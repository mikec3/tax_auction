
const countByCountyAndYear = (parcelList) => {

    // take date format '9/18/24' and return the year '2024' as an integer
const convertYear = (dateString) => {
    const yearBase = '20'
    if (dateString.split('/')[2].length >= 3) {
        return parseInt(dateString.split('/')[2]);
    }
    let yearToReturn = parseInt(yearBase+dateString.split('/')[2])
    return yearToReturn;
  }

  let sum = parcelList.reduce(function (accumulator, curValue) {
        //console.log(accumulator)
        console.log(curValue.Meta.COUNTY)
        let curYear = convertYear(curValue.Meta.AUCTION_DATE)
        if (curValue.Meta.COUNTY in accumulator) {
            if (curYear in accumulator[curValue.Meta.COUNTY]) {
                console.log(accumulator[curValue.Meta.COUNTY][curYear])
                accumulator[curValue.Meta.COUNTY][curYear]['Count']++;
                accumulator[curValue.Meta.COUNTY][curYear]['TAXABLE_TOTAL'] = 
                accumulator[curValue.Meta.COUNTY][curYear]['TAXABLE_TOTAL'] + curValue.Tax.TAXABLE_TOTAL;
            } else {  // county is in accumulator, but the current year has not been initialized yet
                accumulator[curValue.Meta.COUNTY][curYear] = 
                {
                Count: 1, 
                TAXABLE_TOTAL: curValue.Tax.TAXABLE_TOTAL}
                }

        //console.log('here')
        } else {
            accumulator[curValue.Meta.COUNTY] = 
            {[curYear]: {
            Count: 1, 
            TAXABLE_TOTAL: curValue.Tax.TAXABLE_TOTAL}
            }
        }
        return accumulator;

    }, {})

    return sum;

}

export {countByCountyAndYear}