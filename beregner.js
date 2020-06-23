window.addEventListener('DOMContentLoaded', function(){
    let salesPrice = document.querySelector('.row-3_row-2_row-5_el-2');
    let newPriceResult = document.querySelector('.nypris-result');
    let estToll = document.querySelector('.est-toll');
    let avgPrice = document.getElementById('average-price');
    let vehicleStateAddition;
    let specialUseAddition;
    let additionSum;
    let afterDeduction = document.querySelector('.row-3_row-1_column-4_el-3')
    let kmRegulation;




    document.querySelector('.row-3_row-1_column-4_el-2').innerHTML = avgPrice.value;
    

    function deductionFunction() {
        let relativeDeductionField = document.querySelector('.row-3_row-1_column-3_el-2');
        let constantDeduction = -2000;
        let relativeDeductionAmount;

        relativeDeductionAmount = parseInt(avgPrice.value) * -0.05
        

        afterDeduction.innerHTML = parseInt(avgPrice.value) + relativeDeductionAmount + constantDeduction; 
        relativeDeductionField.innerHTML = relativeDeductionAmount + " kr.";
 
    }


    function newPrice() {
        
        let newPrice = document.getElementById('nyprisberegner-1');
        let extraGear = document.getElementById('nyprisberegner-2');
        newPriceResult.innerHTML = parseInt(newPrice.value) + parseInt(extraGear.value)
    }

   
   
    function vehicleStateFunction() {
        let vehicleState = document.querySelector('#vehicle-state-select');
        let vehicleStateOptions = vehicleState.options[vehicleState.selectedIndex]
        
      

        vehicleStateAddition = parseInt(afterDeduction.innerHTML) * vehicleStateOptions.value;
       if (vehicleStateOptions.text == "Middel") {
            if (vehicleStateAddition < -8000) {
                vehicleStateAddition = -8000;
            }
        }

        if (vehicleStateOptions.text == "Under middel") {
            if (vehicleStateAddition < -20000) {
                vehicleStateAddition = -20000;
            }
        }
        
        
        console.log(vehicleStateAddition)
    }
   
    function specialUseFunction() {
        let specialUseSelect = document.getElementById('special-use-select');
        let specialUseOptions = specialUseSelect.options[specialUseSelect.selectedIndex];


        specialUseAddition = parseInt(afterDeduction.innerHTML) * specialUseOptions.value;
        if (specialUseAddition < -20000) {
            specialUseAddition = -20000;
        }

        
        console.log(specialUseAddition);
        
       
            
    }
    
    function additionSumFunction() {
        let additionSumField = document.querySelector('.row-3_row-2_row-1_el-2');
        

        additionSum = specialUseAddition + vehicleStateAddition
        if (additionSum < -20000) {
            additionSum = -20000;
        }


        additionSumField.innerHTML = additionSum + " kr.";
        console.log(additionSum)
    }

// KilometerDifference regulation ----------------------------------------------------------------------------------------------

    function kmRegulationFunction(){
        let kmDifference = kmDifferenceFunction();
        let carAgeFactor = carAgeFactorFunction();
        let afterDeductionAmount = parseInt(afterDeduction.innerHTML)
        let kmDifferenceSurcharge = kmDifferenceSurchargeFunction();
    

        function carAgeFactorFunction() {
            let carRegistration = new Date(document.getElementById('reg-dato').value).getTime();
            let carRegistrationInYears = carRegistration/(1000*60*60*24*365);
            let now = new Date().getTime();
            let nowInYears = now / (1000*60*60*24*365);

            carAge = Math.floor(nowInYears-carRegistrationInYears);
            const yearFactor = [0.31, 0.22, 0.20, 0.17];

            if (carAge >= 3) {carAge = 3}

            return yearFactor[carAge];
        }
        
        function kmDifferenceFunction() {
        
            let normKm = document.querySelector('#average-km');
            let carKm = document.querySelector('#total-km');
            let kmDifference = parseInt(normKm.value) - parseInt(carKm.value);

            return kmDifference;
        }

        function kmDifferenceSurchargeFunction() {
        
            let normKm = document.querySelector('#average-km');
            let carKm = document.querySelector('#total-km');
            let kmDifferenceSurcharge = (parseInt(normKm.value) - parseInt(carKm.value))/parseInt(normKm.value);

            return kmDifferenceSurcharge;
            
        }

        function priceLevelFunction(){
            let priceLevel = afterDeductionAmount/100000 * kmDifference * carAgeFactor;
            let priceLevel10;
            let priceLevel50 = Math.floor((priceLevel -  priceLevel10)/2);
            let kmDeduction = priceLevel10 + priceLevel50;
            if (kmDifferenceSurcharge > 0) {priceLevel10 = afterDeductionAmount*0.10}
            else if (kmDifferenceSurcharge < 0) {priceLevel10 = afterDeductionAmount*-0.10}
            if (carAge < 10) {
                if(kmDifferenceSurcharge < 0.1 && kmDifferenceSurcharge > -0.1){
                    return 0;
                } else {
                    
                    if (kmDifference > 0) {
                        if(priceLevel10 < priceLevel) {return kmDeduction}
                         else {return priceLevel}
                    } else {
                        if(priceLevel10 < priceLevel) {return priceLevel}
                        else {return kmDeduction}
                    }

                }

            }

            else {
                if (kmDifferenceSurcharge < 0.33 && kmDifferenceSurcharge > -0.33) {
                    return 0;
                } else {
                    if (kmDifference > 0) {
                        if(priceLevel10 < priceLevel) {return kmDeduction}
                         else {return priceLevel}
                    } else {
                        if(priceLevel10 < priceLevel) {return priceLevel}
                        else {return kmDeduction}
                    }
                    
                }
            } 
           
        }
        document.querySelector('.row-3_row-2_row-3_el-2').innerHTML = priceLevelFunction() + " kr.";
        
        kmRegulation = priceLevelFunction();
    }
    



    function estimatedToll() {
        estToll.innerHTML = Math.floor(parseInt(salesPrice.innerHTML)*0.58) + " kr.";
        
    }

    function finalPrice() {
        salesPrice.innerHTML = parseInt(afterDeduction.innerHTML) + additionSum  - kmRegulation + " kr.";
        document.querySelector('.sales-price').innerHTML = salesPrice.innerHTML;
    }




    
    deductionFunction();

    vehicleStateFunction();
    
    specialUseFunction();
       


 
    additionSumFunction()
    
    newPrice();
    
    kmRegulationFunction() 
    finalPrice(); // 2 !!
    estimatedToll();  // 1 !!
    // numbered in reverse order
})










function foobar(foo, bar) {
    return foo + bar;
}


function calculate() {
    let inputvalue = 123123;
    let foobarresult = foobar(inputvalue, 2);
}

