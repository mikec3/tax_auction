import React, {useState, useEffec, useRef} from 'react'



function useNumberFormat(number) {

	//format TAXABLE_TOTAL values (for instance 100,00 -> 100K)
const formatNumber = function (dollarFigure) {

	// convert from input dollarFigure to an integer
	//let numType = parseInt(dollarFigure.replace(/[^0-9]/g, ""));
	let numType = dollarFigure;

	// if number is over 1M
	if (numType >= 1000000) {

		// rounding to 1 decimal for millions
		let mill = numType/1000000
		mill = +mill.toFixed(1);
		return String(mill)+"M"

	// if number is less than 1M
	} else {
		// rounding to nearest integer for thousands
		return String(parseInt(numType/1000))+"K"
	}
}

console.log(number);

return formatNumber(number);

}

export default useNumberFormat;