var map = L.map('map').setView([57.11973723727868, -2.13965135269459], 17);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiamFkb25uazUwIiwiYSI6ImNsMHgzb3IzcTFnaGIzZG41OHJpbWNhd3YifQ.iRmUKqleOXpk27nXvL-zkA'
}).addTo(map);

var fullBatteryCharge = 75
var evCarRange = 108

//	Calculate the Range per kWh using the formula
var rangePerBP = evCarRange/fullBatteryCharge
console.log(rangePerBP + ' kwh')

//	collect the EV state of charge and convert to percentage
var SOC = 26
var SOC = SOC/100
console.log(SOC + ' %')

//Subtract 10% battery power from the CBP for allowance.
var SOC = SOC-0.1
console.log(SOC + ' %')

//Using the SOC minus 10%, calculate the safe Drivable Range of the EV (DR)
var safeDrivableDistance = evCarRange*SOC
console.log(safeDrivableDistance +' miles')


chargestations();

        function chargestations(){
            var distance = 0.5
            var longitude = -2.138283
            var latitude = 57.1189654
            axios.get('https://chargepoints.dft.gov.uk/api/retrieve/registry/format/json', {
                params:{
                    lat: latitude,
                    long: longitude,
                    dist: safeDrivableDistance
                }

            } )
            .then(function(response){
                console.log(response)
                console.log(safeDrivableDistance)
                // formating to get stuffs
                var Chargerlat = response.data.ChargeDevice[2].ChargeDeviceLocation.Latitude
                var ChargerLong = response.data.ChargeDevice[2].ChargeDeviceLocation.Longitude

                L.marker([Chargerlat, ChargerLong]).addTo(map);
                // var ChargerlatOutput = `
                
                // `;
            })
            .catch(function(){
                console.log(error)
            })
        }


//getting the form data
function JourneyForm(event){
    event.preventDefault();
    console.log('form submited');
    

    //getting the form data
    var jstart   = document.getElementById('journeystart').value;
    var jfinish  = document.getElementById('journeyfinish').value;
    var SOC      = document.getElementById("evSOC").value;
    var EVrange  = document.getElementById("EVrange").value;
    var charger  = document.getElementById("charger").value;
    console.log(jstart)
    console.log(EVrange)
}

  // get Journey planner Form
const journeyForm = document.getElementById('journey');

// add listener to the form
journeyForm.addEventListener('submit', JourneyForm)
