
function addAdvert(){
    let index = 1;
    let adverts = document.querySelector('.ads')
    
    let existingAdvert = document.querySelector('.newAdvert');


    let newAdvert = existingAdvert.cloneNode(true);

    adverts.appendChild(newAdvert)


}

function yearKmRegulation(){
    let thisYear = 2020;
    let registrationYear = document.querySelectorAll('.registeredDate');
    let kmInput = document.querySelectorAll('.advertKm');
    let myCarYear = thisYear - (new Date(document.getElementById('reg-dato').value).getFullYear());
    let yearArray = [];

    kmInput.forEach(input=>{
        if (input.value == "") {
            input.style.background = '#5a5';
        } else {
            input.style.background = '#fff'
            
        }
    })
    
    registrationYear.forEach(year=>{
        if (year.value == ""){
            year.style.background = '#5a5';
        }else {
            year.style.background = '#fff';
            yearArray.push(thisYear-year.value);
        }
    })

    let regulatedKmNumber = [];
    
    for (i=0; i < yearArray.length; i++){
        regulatedKmNumber.push( ( kmInput[i].value / yearArray[i] ) * myCarYear)
        
    }

    let kmSum = 0;

    regulatedKmNumber.forEach(km=>{
        kmSum+=km;
    })

    let averageKm = Math.floor(kmSum/regulatedKmNumber.length)
    //  console.log(kmSum)
    return averageKm;
}


function averagePriceCalc() {
    let inputValue = document.querySelectorAll('.advertPrice');
    let priceArray = [];
    
        inputValue.forEach(input=>{

            if (input.value == "") {
                input.style.background = '#5a5';
            } else {
                input.style.background = '#fff';
                priceArray.push(parseInt(input.value))
            }
            
        })
    
    let priceSum = 0;
    priceArray.forEach(price=>{
        priceSum += price;
    })
    let averagePrice = priceSum/priceArray.length
    // console.log(priceArray, averagePrice)

    document.querySelector('.row-3_row-1_column-4_el-2').innerHTML = Math.floor(averagePrice);
    return Math.floor(averagePrice)
    
}


// ekstraudstyr formel
function optionalsFormula(myOptionals, avgOptionals, ageRate){
    return (myOptionals-avgOptionals)*ageRate
}

function optionalsAverage(){

    let inputs = document.querySelectorAll('.extraGear');
    let inputsArray = [];
    inputs.forEach( e=> {
        if (e.value == ""){
            e.style.background = '#5a5';
        } else {
            e.style.background = '#fff';
            inputsArray.push(parseInt(e.value))
        }
    })

    let inputSum = 0;

    inputsArray.forEach(input=> {
        inputSum += input;
       
    })

    let inputAverage = Math.floor(inputSum/inputsArray.length);
    return inputAverage;
}

function optionalsAgeRate(year){
    let rate = [1, 0.70, 0.57, 0.45, 0.33, 0.20, 0.15, 0.10, 0];
    return rate[year]
}

function optionalsCalc(){
    let myOptionals = parseInt(document.getElementById('nyprisberegner-2').value);
    let avgOptionals = optionalsAverage();
    let year = carAgeFunction();
    let ageRate = optionalsAgeRate(year);

    document.querySelector('.row-3_row-2_row-2_el-2').innerHTML = optionalsFormula(myOptionals, avgOptionals, ageRate) + ' kr.';

    return optionalsFormula(myOptionals, avgOptionals, ageRate)

    

}



function salesPrice(averagePrice, relDeduction, constDeduction){
    return averagePrice * relDeduction + constDeduction;
}

function salesPriceCalc(){
    let averagePrice = averagePriceCalc();

    let relDeductionField = document.querySelector('.row-3_row-1_column-3_el-2');
    relDeductionField.innerHTML = averagePrice * -0.05;
    let relDeduction = 0.95;
    let constDeduction = -2000
    let salesPriceField = document.querySelector('.row-3_row-1_column-4_el-3');
    salesPriceResult = salesPrice(averagePrice, relDeduction, constDeduction);
    salesPriceField.textContent = salesPriceResult;
    return salesPriceResult;
    
}

function vehicleCondition(salesPrice, input) {
    let vehicleCondition = salesPrice * input;
    return (vehicleCondition > -20000) ? vehicleCondition: -20000;

}

function specialUse(salesPrice, input) {
    let specialUseAmount = salesPrice * input;
    return (specialUseAmount > -20000) ? specialUseAmount: -20000;
}

function useAndCondition(){
    let salesPrice = salesPriceCalc();
    let carCondition = document.getElementById('vehicle-state-select');
    let carConditionSelected = carCondition.options[carCondition.selectedIndex];
    
    let specialUseField = document.getElementById('special-use-select');
    let specialUseFieldSelected = specialUseField.options[specialUseField.selectedIndex];
    
    
    let specialUseAmount = specialUse(salesPrice, specialUseFieldSelected.value); 
    let carConditionAmount = vehicleCondition(salesPrice, carConditionSelected.value);

    
    
    let returnAmount = specialUseAmount + carConditionAmount;
    return (returnAmount > -20000) ? returnAmount: -20000;
    
}


function carAgeFunction(){
let carReg = new Date(document.getElementById('reg-dato').value).getTime();
let carRegYears = carReg / (1000*60*60*24*365.25);
let now = (new Date().getTime())/(1000*60*60*24*365);
let carAge = Math.floor(now - carRegYears)

return carAge;
}
function kmRegulation(){
    

    
    function carAgeFactor(){
        let carAge = carAgeFunction();
        const yearFactor = [0.31, 0.22, 0.20, 0.17];

        if (carAge >= 3) {
            carAge = 3;
        }

        return yearFactor[carAge]
    }
    
    function kmDifference(normKm, carKm){
        return normKm - carKm;
    }

    function kmDeviation(normKm, carKm){
        return (normKm - carKm) / normKm;
    }

    function priceLevel(salesPrice, kmDif, yearFactor){
        return salesPrice/100000 * kmDif * yearFactor
    }

    function priceLevel50(priceLevel, priceLevel10){
        return (priceLevel - priceLevel10)/2;
    }

    function kmDeduction(priceLevel10, priceLevel50){
        return  priceLevel10 + priceLevel50;
    }

    function kmCalc(){
        let normKm = yearKmRegulation();
        let carKm = parseInt(document.getElementById('total-km').value);
        let salesPrice = salesPriceCalc();
        let yearFactor = carAgeFactor();
        let carAge = carAgeFunction();
        let kmDif = kmDifference(normKm, carKm);
        let kmDev = kmDeviation(normKm, carKm);

        let pLevel = priceLevel(salesPrice, kmDif, yearFactor);

        let pLevel10 = (kmDev > 0) ? salesPrice*0.1: salesPrice*-0.1;
    
        let pLevel50 = priceLevel50(pLevel, pLevel10);
        let totalDeduction = kmDeduction(pLevel10, pLevel50);

        if (carAge < 10){
            if (kmDev < 0.1 && kmDev > -0.1) {
                return 0;
            } else {
                if (kmDif > 0) {
                    if (pLevel > pLevel10) {
                        return totalDeduction;
                    } else {
                        return pLevel;
                    }
                } else {
                    if (pLevel > pLevel10){
                        return pLevel
                    } else {
                        return totalDeduction;
                    }
                }
            } 


        } else { // car is 10 year or older
            if (kmDev < 0.33 && kmDev > -0.33) {
                return 0;
            } else {
                if (kmDif > 0) {
                    if (pLevel > pLevel10) {
                        return totalDeduction;
                    } else {
                        return pLevel;
                    }
                } else {
                    if (pLevel > pLevel10){
                        return pLevel
                    } else {
                        return totalDeduction;
                    }
                }
            } 
        }
    
    }

    document.querySelector('.row-3_row-2_row-3_el-2').innerHTML = Math.floor(kmCalc());
    return kmCalc();
}

function otherRegulationFunction() {
    
    let inputValue = document.querySelector('#other-regulations').value
    
    
    if (inputValue == "") {
       // console.log(inputValue)
       // console.log(parseInt(inputValue))
    } else {
       // console.log(inputValue-100)
       // console.log(parseInt(inputValue)-1000)
    }
    let salesPrice = salesPriceCalc();
    document.querySelector('.row-3_row-2_row-4_el-2').innerHTML = inputValue + "%"
    document.querySelector('.row-3_row-2_row-4_el-4').innerHTML = salesPrice * (inputValue/100);
    
    return salesPrice * (inputValue/100);

}



function finalPrice(){
    let finalpriceField = document.querySelector('.row-3_row-2_row-5_el-2');
    let finalpriceFieldTwo = document.querySelector('.sales-price');
    document.querySelector('.row-3_row-2_row-1_el-2').innerHTML = useAndCondition();
    let salesPrice = salesPriceCalc();
    let carCondition = useAndCondition();
    let kmReg = kmRegulation();
    let otherRegulation = otherRegulationFunction();
    let optionals = optionalsCalc();
    
    let finalPriceResult = Math.floor(salesPrice + carCondition + kmReg + otherRegulation + optionals);

    finalpriceField.innerHTML = finalPriceResult;
    finalpriceFieldTwo.innerHTML = finalPriceResult;
    

    return finalPriceResult;
}

function estToll(){
    let estTollField = document.querySelector('.est-toll');
    estTollField.innerHTML = Math.floor(finalPrice()*0.58);
}





document.addEventListener('keyup', function(event){
    if (event.keyCode === 13) {
        estToll();
        
    }
})
