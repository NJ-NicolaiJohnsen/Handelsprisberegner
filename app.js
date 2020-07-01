function addAdvert(){
    let advertContainer = document.querySelector('.ads');
    let existingAdField = document.querySelector('.newAdvert');

    let newAdField = existingAdField.cloneNode(true);

    let newAdChildren = newAdField.children;
   

    for (i=1; i< newAdChildren.length; i++){
        newAdChildren[i].value = '';
    }

    advertContainer.appendChild(newAdField);


    let adNumber = document.querySelectorAll('.newAdvert span');
    let adIndex = 0;

    adNumber.forEach(car=>{
        adIndex++;
        car.innerHTML = 'Bil ' + adIndex;
    })
        
}
//INPUTS ----------------------------------------------------------------------------------
function getInputs(){
    let adverts = [];
    document.querySelectorAll('.newAdvert').forEach(ad=>{
       
        adverts.push({
            price: parseFloat(ad.querySelector('.advertPrice').value),
            km:  parseFloat(ad.querySelector('.advertKm').value),
            years:  parseFloat(ad.querySelector('.registeredDate').value),
            optionals:  parseFloat(ad.querySelector('.extraGear').value)
        })    
    })

    let carConditionSelect = document.querySelector('#vehicle-state-select');
    let carConditionOptions = parseFloat(carConditionSelect.options[carConditionSelect.selectedIndex].value);

    let specialUseSelect = document.getElementById('special-use-select');
    let specialUseOptions = parseFloat(specialUseSelect.options[specialUseSelect.selectedIndex].value);

    let inputs = {
        ads: adverts,
        myCarDate: document.getElementById('reg-dato').value,
        myCarKm: parseFloat(document.getElementById('total-km').value),
        newPrice: parseFloat(document.getElementById('nyprisberegner-1').value),
        myCarOptionals: parseFloat(document.getElementById('nyprisberegner-2').value),
        carCondition: carConditionOptions,
        specialUse: specialUseOptions,
        other: parseFloat(document.getElementById('other-regulations').value)
    }
    return inputs;
}

// CALCULATIONS ------------------------------------------------------------
function doCalculations(inputs){
    let data = inputs;
    
   
    function myCarYear(){
        let year = new Date(data.myCarDate).getFullYear();
        let today = new Date().getFullYear();
        let age = today-year;
            
        return age;
    }

    function myCarYearMonth(){
        let milliseconds = new Date(data.myCarDate).getTime();
        let today = new Date().getTime();

        let age = today-milliseconds;
        age = Math.floor(age / (1000*60*60*24*365.25));
        return age;
    } 
    
    function averageSalesPrice() {

        let priceSum = 0;

        data.ads.forEach(ad=>{
            priceSum+=ad.price
        })

        let priceAvg = Math.floor(priceSum/data.ads.length);
        
        return priceAvg;
    }
   
    //Vognkort --------------
    function averageKilometers(){
        let myCarAge = myCarYear();

        myCarAge = (myCarAge === 0) ? 1: myCarAge;
        let thisYear = new Date().getFullYear();

        let kmDriven = [];
        let adCarAge = [];

        data.ads.forEach(ad=>{
            kmDriven.push(ad.km)
        })
        data.ads.forEach(ad=>{
            adCarAge.push(thisYear-ad.years)
        })

        let kmAvg = 0;

        for (i=0; i< kmDriven.length; i++) {
            kmAvg += (kmDriven[i] / adCarAge[i] * myCarAge) / kmDriven.length;
        }        
        
        return kmAvg;
    }
 

    function optionalsFormula(myOptionals, avgOptionals){
        let rates = [1, 0.7, 0.57, 0.45, 0.33, 0.20, 0.15, 0.10, 0];
        let age = myCarYearMonth();
        age = (age < 8) ? age : 8;
        
        return (myOptionals-avgOptionals)*rates[age];
    }
        
    function avgOptionalsCalc(){
        let optionalsSum = 0;
        
        data.ads.forEach(ad=>{
            optionalsSum += ad.optionals;
        })
        
        let optionalsAvg = optionalsSum / data.ads.length;
       
        return optionalsAvg;
    }

    function optionalsCalc() {
        let myOptionals = data.myCarOptionals;
        let avgOptionals = avgOptionalsCalc();
        
        let optionalsDepreciated = Math.floor(optionalsFormula(myOptionals, avgOptionals));
        
        return optionalsDepreciated;
    }

    // Most price calculation is done under here
    function fivePercentDeduction(){
        let deduction = averageSalesPrice()*-0.05;
        return deduction;
    }

    function deductedPrice(){
        let marketPrice = averageSalesPrice();
        let fivePercent = fivePercentDeduction();
        const constant = -2000;
        
        let afterDeductions = marketPrice + fivePercent+constant;
        return afterDeductions;
    }



    function carCondition(marketPrice, percent){
        let result = marketPrice * percent;
        return (result > -20000) ? result : -20000;
    }

    function specialUse(marketPrice, percent) {
        let result = marketPrice*percent;
        return (result > -20000) ? result : -20000;
       
    }

    function conditionAndUse(){
        let marketPrice = averageSalesPrice();
        let conditionPercent = data.carCondition;
        let specialUsePercent = data.specialUse;

        let conditionAmount = carCondition(marketPrice, conditionPercent);
        let specialUseAmount = specialUse(marketPrice, specialUsePercent);
        
        let result = conditionAmount + specialUseAmount;
   
        return (result > -20000) ? result : -20000;
    }

    function kmRegulation(){
        

        function kmDifference(avgKm, myCarKm){
            let difference = avgKm-myCarKm;
            return difference;
        }

        function kmDeviation(avgKm, myCarKm){
            let deviation = (avgKm - myCarKm) / avgKm;
            return deviation;
        }

        function ageRate(age){
            
            let rates = [0.31, 0.22, 0.20, 0.17];
            age = (age < 3) ? age: 3;
            return rates[age];
        }
        
        function priceLevel(avgPrice, kmDif, ageRate){
            let priceLevel =  avgPrice/100000*kmDif*ageRate;
            return priceLevel;
        }

        function priceLevel10(avgPrice, kmDeviation){
            let priceLevel10 = 0;
            priceLevel10 = (kmDeviation > 0) ? avgPrice*0.10 : avgPrice *  -0.10;
            return priceLevel10;
        }
        
        function priceLevel50(priceLevel, priceLevel10){
            return (priceLevel - priceLevel10) * 0.5;
        }

        function calcRegulation(){
            let age = myCarYearMonth();
            let avgPrice = averageSalesPrice();
            let avgKm = averageKilometers();
            let myCarKm = data.myCarKm;
            let kmDif = kmDifference(avgKm, myCarKm);
            let deviation = kmDeviation(avgKm, myCarKm); 
            let pLevel = priceLevel(avgPrice, kmDif, ageRate(age));
            let pLevel10 = priceLevel10(avgPrice, deviation)
            let pLevel50 = priceLevel50(pLevel, pLevel10)

            // if priceLevel is over 10 % of market price 
            let overTenPercentOfPrice = pLevel10 + pLevel50;
            
        }

        return calcRegulation();













    }
    


    function finalPrice(){
        let price = deductedPrice()+optionalsCalc()+conditionAndUse()+kmRegulation();
        return price;
    }

    finalPrice()

    let outputs = {
        finalPrice: finalPrice(),
        avgPrice:  averageSalesPrice(),
        optionals: optionalsCalc(),
        deductedPrice: deductedPrice(),
        fivePercent: fivePercentDeduction(),
        conditionAndUse: conditionAndUse()

    }
    return outputs;
}


// OUTPUTS -----------------------------------------------------------------------------------
function outputs(results){
    let output = results;

    document.querySelector('.row-3_row-1_column-4_el-2').innerHTML = Math.floor(output.avgPrice) + ' kr.';

    document.querySelector('.row-3_row-2_row-2_el-2').innerHTML = Math.floor(output.optionals) + ' kr.';

    document.querySelector('.row-3_row-1_column-4_el-3').innerHTML = Math.floor(output.deductedPrice) + ' kr.';

    document.querySelector('.row-3_row-1_column-3_el-2').innerHTML = Math.floor(output.fivePercent) + ' kr.';
    document.querySelector('.row-3_row-2_row-5_el-2').innerHTML = Math.floor(output.finalPrice) + ' kr.'

    document.querySelector('.row-3_row-2_row-1_el-2').innerHTML = Math.floor(output.conditionAndUse) + ' kr.'


}

// Validates the calculator; checks if all inputs are filled in -------------------------
function validateForm() {
    let isValid = true;

    let inputs = document.querySelectorAll('input');

    inputs.forEach(function(e){
        if (e.value == '') {
            isValid = false;
            e.style.background = 'red';
        } else {
            e.style.background = null;
        }
    })


    return isValid;
}

// triggers everything ----------------------------------------------
document.addEventListener('keyup', event=>{
    if (event.keyCode === 13) {
       // if(validateForm()) {

            var inputs = getInputs();
            let calc = doCalculations(inputs)
            outputs(calc);
      //  }

    }
})