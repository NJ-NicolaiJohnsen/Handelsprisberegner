
function carIndex(item){
        let adIndex = 0;
        
        item.forEach(car=>{
            adIndex++;
            car.innerHTML = 'Bil ' + adIndex;
        })
}

function addAdvert(){
    
    if (document.querySelectorAll('.ad').length < 7) {
    
        let advertContainer = document.querySelector('.ads');
        let existingAdField = document.querySelector('.ad-template');
    
        let newAdField = existingAdField.cloneNode(true);
        newAdField.style.display = 'block';
        newAdField.className = newAdField.className.replace('ad-template', 'ad');
        let newAdChildren = newAdField.children;
        console.log(newAdChildren)
        for (i=0; i< newAdChildren.length; i++){
            
            newAdChildren[i].value = "";
            
            newAdChildren[i].style.backgroundColor = null;
            newAdChildren[i].placeholder = "";
        }
        
        advertContainer.appendChild(newAdField);
        
        //carIndex(document.querySelectorAll('.ad-number'))
       
    }

}

function addDeleteFunction(){
    
    let btns = document.querySelectorAll('.ad button');
    btns[btns.length-1].addEventListener('click', deleteAdCar);
}


function deleteAdCar() {
  
    let adArray = [...document.querySelectorAll('.ad button')];
    const myIndex = adArray.indexOf(this);
    if (adArray.length > 1) {

        this.parentElement.parentElement.remove()
        document.querySelectorAll('.optionals-number')[myIndex].remove()
        
        document.querySelectorAll('.optionals-inputs').forEach(row=>{
            row.querySelectorAll('.optionals')[myIndex].remove()
        })
        
        //carIndex(document.querySelectorAll('.ad-number'))
        carIndex(document.querySelectorAll('.optionals-number'))
    }
} 


function addDeleteOptional(){
    const btns = document.querySelectorAll('.optionals-inputs .optional-delete-btn');
    btns[btns.length-1].addEventListener('click', deleteOptional)
}


function deleteOptional(){
    let optionalsArray = [...document.querySelectorAll('.optionals-inputs .optional-delete-btn')];
    if (optionalsArray.length > 1){
        this.parentElement.remove()
    }

}



function addOptionalsLabel(){
     

    if (document.querySelectorAll('.optionals-number').length < 7) {

        let optionalsLabels = document.querySelector('.optionals-labels');
        
        let newOptionalsLabel = document.createElement('p');
        newOptionalsLabel.className = 'optionals-number h5 text-center col';
        optionalsLabels.appendChild(newOptionalsLabel);

        carIndex(document.querySelectorAll('.optionals-number'))
        
        let optionalsInputs = document.querySelectorAll('.optionals-inputs');
        optionalsInputs.forEach(optional=>{

            let newCheckbox = document.createElement('input');
            newCheckbox.className = 'col optionals';
            newCheckbox.type = 'checkbox';
            optional.appendChild(newCheckbox);
        })
    }
}


function addOptional(){

    function OptionalConditional(conditionalItem){
        let container = document.querySelector('.optionals-container');
        let existingOptional = document.querySelector(`.${conditionalItem}`)
        let newInputs = existingOptional.cloneNode(true);

        newInputs.style.display = 'flex';
        newInputs.className = newInputs.className.replace('optionals-inputs-template', 'optionals-inputs');

        newInputsChildren = newInputs.children;
        newInputsChildren[1].checked = false;
        newInputsChildren[0].children[2].checked = false;
        newInputsChildren[0].children[0].value = '';
        newInputsChildren[0].children[1].value = '';
        newInputsChildren[0].children[0].style.backgroundColor = null;
        newInputsChildren[0].children[1].style.backgroundColor = null;
        container.appendChild(newInputs)
    }

    if (document.querySelector('.optionals-inputs')) {
        OptionalConditional('optionals-inputs')
    } else {
        OptionalConditional('optionals-inputs-template')
    }

}



//INPUTS ----------------------------------------------------------------------------------
function getInputs(){
    let adverts = [];
    document.querySelectorAll('.ad').forEach(ad=>{
        adverts.push({
            price: parseFloat(ad.querySelector('.ad-price').value),
            km:  parseFloat(ad.querySelector('.ad-km').value),
            years:  parseFloat(ad.querySelector('.ad-year').value),
        })    
    })

    let optionalsArray = [];
    document.querySelectorAll('.optionals-inputs').forEach(e=>{
        optionalsArray.push({
            gear: e.querySelector('.optionals-gear').value,
            price: parseFloat(e.querySelector('.optionals-price').value),
            myCar: e.querySelector('.my-optionals'),
            fields: e.querySelectorAll('.optionals')
        })
    })

    let carConditionSelect = document.querySelector('#vehicle-quality');
    let carConditionOptions = parseFloat(carConditionSelect.options[carConditionSelect.selectedIndex].value);

    let specialUseSelect = document.getElementById('special-use');
    let specialUseOptions = parseFloat(specialUseSelect.options[specialUseSelect.selectedIndex].value);

    let inputs = {
        ads: adverts,
        optionals: optionalsArray,
        myCarDate: document.getElementById('registration').value,
        myCarKm: parseFloat(document.getElementById('km-driven').value),
        newPrice: parseFloat(document.getElementById('new-price').value),
        carCondition: carConditionOptions,
        specialUse: specialUseOptions,
        other: parseFloat(document.getElementById('other-regulation').value)
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
   
    //Vognkort -----------------------------------------------------------------------------
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
        let eachCarRegulated = {};
        for (i=0; i< kmDriven.length; i++) {
            kmAvg += (kmDriven[i] / adCarAge[i] * myCarAge) / kmDriven.length;
            let key = 'car_'+i;
            eachCarRegulated[key] = kmDriven[i] / adCarAge[i] * myCarAge;
        }

        let returnObject = {
            avg: kmAvg,
            eachCar: eachCarRegulated
        }

        return returnObject;
    }
 

    function optionalsFormula(myOptionals, avgOptionals){
        let rates = [1, 0.7, 0.57, 0.45, 0.33, 0.20, 0.15, 0.10, 0];
        let age = myCarYearMonth();
        age = (age < 8) ? age : 8;
        
        return (myOptionals-avgOptionals)*rates[age];
    }
        
    function avgOptionalsCalc(){

        let optionalSums = {};

        for (i=0; i<data.optionals.length; i++){
            for (j=0; j<data.optionals[i].fields.length; j++){
                if (data.optionals[i].fields[j].checked) {
                    let carKey = 'car_'+j;
                    let price = data.optionals[i].price;
                    price += optionalSums[carKey] ? parseFloat(optionalSums[carKey]) : 0;
                    optionalSums[carKey] = price;
                }
            }
        }
        
        let avg = 0;

       Object.keys(optionalSums).forEach((key) => {
           avg += optionalSums[key]/data.optionals[0].fields.length
       })
       
        return avg;
    }

    
    function myOptionalsCalc(){
        let priceSum = 0;
        
        data.optionals.forEach(optional=>{
            if (optional.myCar.checked) {
                priceSum += optional.price;
            }
            
        })

        return priceSum;
    }

   

    function optionalsCalc() {
        let myOptionals = myOptionalsCalc();
        let avgOptionals = avgOptionalsCalc();
        
        let optionalsDepreciated = Math.floor(optionalsFormula(myOptionals, avgOptionals));
        
        return optionalsDepreciated;
    }


    // Most price calculation is done under here --------------------------------------------------
    function fivePercentDeduction(){
        let deduction = averageSalesPrice()*-0.05;
        return deduction;
    }

    function deductedPrice(){
        let avgPrice = averageSalesPrice();
        let fivePercent = fivePercentDeduction();
        const constant = -2000;
        
        let afterDeductions = avgPrice + fivePercent+constant;
        return afterDeductions;
    }



    function carCondition(marketPrice, percent){
        let result = marketPrice * percent;
        if (result > 8000) {
            return 8000
        } else {
            return (result > -20000) ? result : -20000;
        }
        
    }

    function specialUse(marketPrice, percent) {
        let result = marketPrice*percent;
        return (result > -20000) ? result : -20000;
       
    }

    function conditionAndUse(){
        let marketPrice = deductedPrice();
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
        
        function priceLevel(marketPrice, kmDif, ageRate){
            let priceLevel =  marketPrice/100000*kmDif*ageRate;
            return priceLevel;
        }

        function priceLevel10(marketPrice, kmDeviation){
            let priceLevel10 = 0;
            priceLevel10 = (kmDeviation > 0) ? marketPrice*0.10 : marketPrice *  -0.10;
            return priceLevel10;
        }
        
        function priceLevel50(priceLevel, priceLevel10){
            return (priceLevel - priceLevel10) * 0.5;
        }

        function calcRegulation(){
            const age = myCarYearMonth();
            const marketPrice = deductedPrice();
            const avgKm = averageKilometers().avg;
            const myCarKm = data.myCarKm;
            const kmDif = kmDifference(avgKm, myCarKm);
            const deviation = kmDeviation(avgKm, myCarKm); 
            const pLevel = priceLevel(marketPrice, kmDif, ageRate(age));
            const pLevel10 = priceLevel10(marketPrice, deviation)
            const pLevel50 = priceLevel50(pLevel, pLevel10)
            // if priceLevel is over 10 % of market price 
            const overTenPercentOfPrice = pLevel10 + pLevel50;
            
            if (age < 10) {
                if (deviation < 0.1 && deviation > -0.1) {
                    return 0;
                } else {
                    if (kmDif > 0){
                        if (pLevel < pLevel10) {
                            return pLevel;
                        } else {
                            return overTenPercentOfPrice;
                        }
                    } else {
                        if (pLevel > pLevel10) {
                            return pLevel;
                        } else {
                            return overTenPercentOfPrice;
                        }
                    }
                }
            } 
            else {
                if (deviation < 0.33 && deviation > -0.33) {
                    return 0;
                } else {
                    if (kmDif > 0){
                        if (pLevel < pLevel10) {
                            return pLevel;
                        } else {
                            return overTenPercentOfPrice;
                        }
                    } else {
                        if (pLevel > pLevel10) {
                            return pLevel;
                        } else {
                            return overTenPercentOfPrice;
                        }
                    }
                }
            }
        }

        return calcRegulation();
    }
    
    

    function otherRegulations(){
        let percent = data.other/100;
        let marketPrice = deductedPrice();
        if (Number.isNaN(data.other)){
            percent = 0;
            
        } else {
            throw "Something went wrong"
        }
        
        let results = {
            otherRegulationSum: marketPrice*percent,
            percent: data.other
        }
        return results;
    }

    function finalPrice(){
        let price = deductedPrice()+optionalsCalc()+conditionAndUse()+kmRegulation()+otherRegulations().otherRegulationSum;
        return price;
    }

    function newPriceCalc(){
        return myOptionalsCalc()+data.newPrice;
    }

    let outputs = {
        finalPrice: finalPrice(),
        avgPrice:  averageSalesPrice(),
        optionals: optionalsCalc(),
        marketPrice: deductedPrice(),
        fivePercent: fivePercentDeduction(),
        conditionAndUse: conditionAndUse(),
        kmRegulation: kmRegulation(),
        other: otherRegulations(),
        newPrice: newPriceCalc(),
        avgKm: averageKilometers()
    }
    return outputs;
}


// OUTPUTS -----------------------------------------------------------------------------------
function outputs(results){
    let output = results;

    document.querySelector('#final-price').value = Math.floor(output.finalPrice) + ' kr.'
    document.querySelector('#final-price-2').value = Math.floor(output.finalPrice) + ' kr.'

    document.querySelector('#new-price-2').value = Math.floor(output.newPrice) + ' kr.';
    document.querySelector('.new-price').value = Math.floor(output.newPrice) + ' kr.';
    document.querySelector('#useAndQualityOutput').value = Math.floor(output.conditionAndUse) + ' kr.'
    document.querySelector('#optionalsOutput').value = Math.floor(output.optionals) + ' kr.'
    document.querySelector('#kmRegulationOutput').value = Math.floor(output.kmRegulation) + ' kr.'
    document.querySelector('#otherRegulationOutput').value = Math.floor(output.other.otherRegulationSum) + ' kr.'
    document.querySelector('#discount').value = Math.floor(output.fivePercent) + ' kr.'
    document.querySelector('#avg-sales-price').value = Math.floor(output.avgPrice) + ' kr.'
    document.querySelector('#deducted-price').value = Math.floor(output.marketPrice) + ' kr.'
    document.querySelector('#avg-kilometers').value = Math.floor(output.avgKm.avg) + ' kr.'

    function eachCarKmRegulation(){
        let adKmRegulated =  document.querySelectorAll('.ad-km-regulated');
        let index = 0;
        adKmRegulated.forEach(ad =>{
            let key = 'car_'+index;
            let str = ' km'
            let outputValue = Math.floor(output.avgKm.eachCar[key])
            ad.value = `${outputValue}`.concat(str)
            index++
        })
    }
    eachCarKmRegulation()
}

// Validates the calculator; checks if all inputs are filled in -------------------------
function validateForm() {
    let isValid = true;

    let inputs = document.querySelectorAll('input');
   
    inputs.forEach(function(e){
        
        if (!e.hasAttribute("readonly") && e.name !='other-regulation' ){
            
            if (e.value == '') {
               
                isValid = false;
                e.style.background = 'red';
                console.log(e)
            } else {
                e.style.background = null;
            }
        }
       
    })
    console.log(isValid)
    return isValid;
}

// triggers everything -------------------------------------------------------------------------
document.addEventListener('keyup', event=>{
    if (event.keyCode === 13) {
        if(validateForm()) {
            
            var inputs = getInputs();
            let calc = doCalculations(inputs)
            outputs(calc);
        }

    }
})


function topLevelLink(id){
    let item = document.querySelector('#' + id + '').offsetTop
    window.scrollTo({top: item-82, behavior: 'smooth'})

}

for (i = 0; i<1; i++){
    document.getElementById('optionals-button').click();
    document.getElementById('ad-button').click();
}
