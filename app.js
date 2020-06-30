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

function getInputs(){
    let adverts = [];
    document.querySelectorAll('.newAdvert').forEach(ad=>{
        let allInputs = [];
        ad.querySelectorAll('input').forEach(input=>{
            allInputs.push(input.value)
        })
        if (
            for (i=0; i<allInputs.length; i++){
                allInputs[i].value = '';
            }
        ) {
            
        } else {
            adverts.push({
                price: parseInt(ad.querySelector('.advertPrice').value),
                km:  parseInt(ad.querySelector('.advertKm').value),
                years:  parseInt(ad.querySelector('.registeredDate').value),
                optionals:  parseInt(ad.querySelector('.extraGear').value)
            })
        }
         

             

        
        
    })

    let carStateSelect = document.querySelector('#vehicle-state-select');
    let carStateOptions = carStateSelect.options[carStateSelect.selectedIndex].value;
    let specialUseSelect = document.getElementById('special-use-select');
    let specialUseOptions = specialUseSelect.options[specialUseSelect.selectedIndex].value;

    let inputs = {
        ads: adverts,
        myCarDate: document.getElementById('reg-dato').value,
        myCarKm: parseInt(document.getElementById('total-km').value),
        newPrice: parseInt(document.getElementById('nyprisberegner-1').value),
        myCarOptionals: parseInt(document.getElementById('nyprisberegner-2').value),
        carCondition: carStateOptions,
        specialUse: specialUseOptions,
        other: parseInt(document.getElementById('other-regulations').value)
    }
    return inputs;
}





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
        age = Math.floor(age / (1000*60*60*24*365));
        return age;
    } 
    
    function averageSalesPrice() {

        let priceFields = [];
        data.ads.forEach(ad=>{
            priceFields.push(ad.price)
        })
        let priceArray = [];
        

        priceFields.forEach(price=>{
            
            
        
            priceArray.push(parseInt(price.value));
        
        })

        let priceSum = 0;

        priceArray.forEach(price=>{
            priceSum += price
        })

            
        let priceAvg = Math.floor(priceSum/priceArray.length);
        document.querySelector('.row-3_row-1_column-4_el-2').innerHTML = priceAvg + ' kr.'
        console.log(priceFields)
        return priceAvg;
    }
    averageSalesPrice()
    //Vognkort --------------
    function averageKilometers(){
        let thisYear = new Date().getFullYear();
        let myCarYear = new Date(document.getElementById('reg-dato').value).getFullYear();
        let myCarAge = thisYear-myCarYear;
        
        let advertCarYear = document.querySelectorAll('.registeredDate');
        let advertCarAge = [];
        
        advertCarYear.forEach(event => {
            if (event.value == '') {
                event.style.background = '#22aa22';
            } else {
                event.style.background = '#fff';
                advertCarAge.push(thisYear-event.value)
                //  console.log(thisYear-event.value)
            }
        })
        
        let kmArray = [];
        let kmField = document.querySelectorAll('.advertKm');
        
        kmField.forEach(kmDriven=>{
            if (kmDriven.value == '') {
                kmDriven.style.background = '#22aa22';
            } else {
                kmArray.push(parseInt(kmDriven.value))
            }
        })
        
        let kmAvg = 0;
        
        for (i=0; i< kmField.length; i++) {
            kmAvg += Math.floor((kmArray[i] / advertCarAge[i] * myCarAge) / kmField.length);
        }
        
        console.log( kmAvg )
        return kmAvg;
        
    }


    function optionalsFormula(myOptionals, avgOptionals){
        let rates = [1, 0.7, 0.57, 0.45, 0.33, 0.20, 0.15, 0.10, 0];
        let age = myCarAge();
        age = (age < 8) ? age : 8;
        
        return Math.floor(
            (myOptionals-avgOptionals)*rates[age]
            );
        }
        
        function avgOptionalsCalc(){
        let optionalsInput = document.querySelectorAll('.extraGear');
        let optionalsSum = 0;
        
        optionalsInput.forEach(input=>{
            if (input.value == ''){
                input.style.background = '#22aa22';
            } else {
                input.style.background = '#fff';
                optionalsSum += parseInt(input.value);
            }
        })
        
        let optionalsAvg = Math.floor(optionalsSum / optionalsInput.length)
        //console.log(optionalsAvg);
        return optionalsAvg;
    }

    function optionalsCalc() {
        let myOptionals = parseInt(document.getElementById('nyprisberegner-2').value);
        let avgOptionals = avgOptionalsCalc();
        
        let optionalsDepreciated = Math.floor(optionalsFormula(myOptionals, avgOptionals));
        
        document.querySelector('.row-3_row-2_row-2_el-2').innerHTML = optionalsDepreciated + ' kr.';
        console.log(optionalsDepreciated)
        return optionalsDepreciated;
    }

    function deductedPrice(){
        let marketPrice = averageSalesPrice();
        
        
        function fivePercent(){
            let deduction = Math.floor(marketPrice*0.05);
            document.querySelector('.row-3_row-1_column-3_el-2').innerHTML = deduction + ' kr.';
            return deduction;
        }
        console.log(fivePercent())
        const constant = 2000;
        
        let afterDeductions = Math.floor(marketPrice - (fivePercent()+constant));
        document.querySelector('.row-3_row-1_column-4_el-3').innerHTML = afterDeductions + ' kr.';
        
        return afterDeductions;
    }

}



document.addEventListener('keyup', event=>{
    if (event.keyCode === 13) {
        var inputs = getInputs();
        doCalculations(inputs)
        

    }
})


