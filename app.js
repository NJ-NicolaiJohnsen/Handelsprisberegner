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


function averageSalesPrice() {
    let priceFields = document.querySelectorAll('.advertPrice');
    
    let priceArray = [];

    priceFields.forEach(price=>{
        if (price.value == '') {
            price.style.background = '#aa2222';
        } else {
            price.style.background = '#fff';
            priceArray.push(parseInt(price.value));
        }
        
    })

    let priceSum = 0;

    priceArray.forEach(price=>{
        priceSum += price
    })


    let priceAvg = Math.floor(priceSum/priceArray.length);
    document.querySelector('.row-3_row-1_column-4_el-2').innerHTML = priceAvg + ' kr.'

    return priceAvg;
}

//Vognkort --------------
function averageKilometers(){
    let thisYear = new Date().getFullYear();
    let myCarYear = new Date(document.getElementById('reg-dato').value).getFullYear();
    let myCarAge = thisYear-myCarYear;

    let advertCarYear = document.querySelectorAll('.registeredDate');
    let advertCarAge = [];

    advertCarYear.forEach(event => {
        if (event.value == '') {
            event.style.background = '#aa2222';
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
            kmDriven.style.background = '#aa2222';
        } else {
            kmArray.push(parseInt(kmDriven.value))
        }
    })

    let kmAvg = 0;

    for (i=0; i< kmField.length; i++) {
        kmAvg += (kmArray[i]/advertCarAge[i]*myCarAge) / kmField.length;
    }
    console.log( kmAvg )


}





document.addEventListener('keyup', event=>{
    if (event.keyCode === 13) {
        averageSalesPrice()
        averageKilometers()
    }
})


