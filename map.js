var map = L.map('map').setView([57.11973723727868, -2.13965135269459], 17);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiamFkb25uazUwIiwiYSI6ImNsMHgzb3IzcTFnaGIzZG41OHJpbWNhd3YifQ.iRmUKqleOXpk27nXvL-zkA'
}).addTo(map);

//getting the form data
async function JourneyForm(event){
    event.preventDefault();
    console.log('form submited');
    

    //getting the form data
    var jstart   = document.getElementById('journeystart').value;
    var jfinish  = document.getElementById('journeyfinish').value;
    var SOC      = document.getElementById("evSOC").value;
    var EVrange  = document.getElementById("EVrange").value;
    var charger  = document.getElementById("charger").value;
    console.log(jstart + 'jstart')
    console.log(jfinish + 'jfinish')
    console.log(SOC + 'SOC')
    console.log(EVrange + 'EVrange')

    
     //manipulation of the form data to calculation
    SOC = SOC/100
    console.log(SOC + ' %')

    //Subtract 10% battery power from the CBP for allowance.
    SOC = SOC-0.1
    console.log(SOC + ' % is safe SOC')

    //Using the SOC minus 10%, calculate the safe Drivable Range of the EV (DR)
    var safeDrivableDistance = EVrange*SOC
    console.log(safeDrivableDistance +' miles')

    var location = document.getElementById('journeystart').value;
    var geometry = geocode(location);
    
    //locate the charging station by calling the chargestation function.
    var distance = safeDrivableDistance;
    // var geometry = (long);
    setTimeout(console.log(geometry), 5000);
    chargestations(distance, geometry);
}

  // get Journey planner Form
const journeyForm = document.getElementById('journey');

// add listener to the form
journeyForm.addEventListener('submit', JourneyForm)


function chargestations(distance, longitude, latitude){

  
            axios.get('https://chargepoints.dft.gov.uk/api/retrieve/registry/format/json', {
                params:{
                    lat: latitude,
                    long: longitude,
                    dist: distance
                }

            } )
            .then(function(response){
                console.log(response)
                // formating to get stuffs
                var Chargerlat = response.data.ChargeDevice[2].ChargeDeviceLocation.Latitude
                var ChargerLong = response.data.ChargeDevice[2].ChargeDeviceLocation.Longitude

                L.marker([Chargerlat, ChargerLong]).addTo(map);
            })
            .catch(function(){
                console.log(error)
            })
        }
    
        //start the geocoding function.
function geocode(location){
        axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
          params:{
            address:location,
            key:'AIzaSyAKf5i0oElPYrydoQFUiu5k7oBUrR2oIys'
          }
        })
        .then(function(response){
          // Log full response
          console.log(response);
  
          // get the Geometry
          lat = response.data.results[0].geometry.location.lat;
          long = response.data.results[0].geometry.location.lng;
          
          console.log(lat);
          console.log(long);

          return long;
        })
        .catch(function(error){
          console.log(error);
        });
      }

        