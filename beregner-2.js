
        function addAdvert(){
            let index = 1;
            let adverts = document.querySelector('.ads')
            
            let newAdvert = document.createElement('div');
            newAdvert.className = 'newAdvert';
            let advertArray = document.querySelectorAll('.newAdvert');

            advertArray.forEach(()=>{
                index++;
                console.log(index);
            })

            let carElement = document.createElement('span');
            carElement.className = 'carElement';
            CarElementText = document.createTextNode('Bil ' + index)
            carElement.appendChild(CarElementText);            



            let advertPrice = document.createElement('input');
            advertPrice.className = 'advertPrice'
            advertPrice.placeholder = 'udsalgspris';
            advertPrice.type = 'number';
           
           let advertKm = document.createElement('input');
           advertKm.className = 'advertKm';
           advertKm.placeholder = 'Norm km'
           advertKm.type = 'number'
        
           adverts.appendChild(newAdvert);
           newAdvert.appendChild(carElement);
           newAdvert.appendChild(advertPrice);
           newAdvert.appendChild(advertKm);

        }


        function normKmCalc() {
            let inputValue = document.querySelectorAll('.advertKm');
            let kmArray = [];
            
            inputValue.forEach(input=>{
                if (input.value == "") {
                    input.style.background = '#5a5';
                } else {
                    input.style.background = '#fff'
                    kmArray.push(parseInt(input.value));
                }
            })

            let kmSum = 0;
            kmArray.forEach(km=>{
                kmSum +=km
            })

            let averageKm = kmSum/kmArray.length
            return Math.floor(averageKm)

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
            return Math.floor(averagePrice)
           
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



       function kmRegulation(){
            
            function carAgeFunction(){
                let carReg = new Date(document.getElementById('reg-dato').value).getTime();
                let carRegYears = carReg / (1000*60*60*24*365.25);
                let now = (new Date().getTime())/(1000*60*60*24*365);
                let carAge = Math.floor(now - carRegYears)

                return carAge;
            }
            
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
               let normKm = normKmCalc();
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
            
            let inputValue = parseInt(document.querySelector('#other-regulations').value)
            if (inputValue = "") {
                inputValue = 0;
            
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
           
           let finalPriceResult = Math.floor(salesPrice + carCondition + kmReg + otherRegulation);

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
