// Calculation
let kmDifference;
let kmDifferenceSurcharge;
let yearFactor;
let priceLevel;
let priceLevel10;
let priceLevel50;
let kmDeductionValue;
let kmDeductionValue10Year;
let kmDeductionTotal;


let tradingPriceTotal = 220000;
let carAgeInYears = 5;
let standardKilometer = 100000;
let carKmAmount = 140000;
        // Kilometerdefference
kmDifference = standardKilometer - carKmAmount ;
        // Calculate kilometer surcharge
kmDifferenceSurcharge = (standardKilometer - carKmAmount) / standardKilometer ;
        //Calculate yearfactor
            // Yearfactors
let YearFactors = [0.31, 0.22, 0.20, 0.17];
if(carAgeInYears >= 3) {
    yearFactor = YearFactors[3];
} else if(carAgeInYears >= 2) {
    yearFactor = YearFactors[2];
} else if(carAgeInYears >= 1) {
    yearFactor = YearFactors[1];
} else {
    yearFactor = YearFactors[0];
}
    //Results
        //Pricelevel
priceLevel = tradingPriceTotal / 100000 * kmDifference * yearFactor;
    //Pricelevel 10% (10% of tradingprice)
if(kmDifferenceSurcharge > 0) {
    priceLevel10 = tradingPriceTotal * 0.1;
} else if(kmDifferenceSurcharge < 0) {
    priceLevel10 = tradingPriceTotal * -0.1;
} else {
    priceLevel10 = 0;
}
    //Pricelevel 50%
let priceLevel50Calc;
priceLevel50Calc = Math.floor(priceLevel - priceLevel10);
priceLevel50 = priceLevel50Calc * 0.5;
    //Kilometer Deduction Value (Under 10 years)
kmDeductionValue = priceLevel10 + priceLevel50;
    //Price level validation 10 (If deduction is more than 10% of the trading price, you need to engage pricelevel50 and pricelevel10)
let priceLevelValidation10;
if(standardKilometer > carKmAmount) {
     if(priceLevel10 < priceLevel) {
        priceLevelValidation10 = kmDeductionValue;
     } else {
        priceLevelValidation10 = priceLevel;
    }
} else {
        if(priceLevel10 < priceLevel) {
            priceLevelValidation10 = priceLevel;
        } else {
        priceLevelValidation10 = kmDeductionValue;
    }
}
    //Kilometer Deduction Value (Above 10 years)
if(carAgeInYears > 10) {
    if(
        kmDifferenceSurcharge > 0.33 ||
        kmDifferenceSurcharge < -0.33
    ) {
        kmDeductionValue10Year = priceLevelValidation10;
    } else {
        kmDeductionValue10Year = 0;
    }
}
    //End result ( Kilometer Deduction Total)
    let kilometerInfo;
    kilometerInfo = "Diff. " + kmDifference + " km.";
if(carAgeInYears >= 10) {
    kmDeductionTotal = kmDeductionValue10Year;
} else {
    kmDeductionTotal = priceLevelValidation10;
}
console.log(kmDeductionTotal);