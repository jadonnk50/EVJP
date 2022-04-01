var jstart;
var jfinish;  
var SOC; 
var EVrange;
var charger;
var safeDrivableDistance;
var lat;
var long;

  // get Journey planner Form
  const journeyForm = document.getElementById('journey');

  // add listener to the form
  journeyForm.addEventListener('submit', JourneyForm)


//getting the form data
function JourneyForm(event){
    event.preventDefault();
    console.log('form submited');
    

    //getting the form data
    jstart   = document.getElementById('journeystart').value;
    jfinish  = document.getElementById('journeyfinish').value;
    SOC      = document.getElementById("evSOC").value;
    EVrange  = document.getElementById("EVrange").value;
    charger  = document.getElementById("charger").value;
    
    console.log(jstart + ' is jstart location')
    console.log(jfinish + ' is the jfinish location')
    console.log(SOC + ' is the SOC not yet converted')
    console.log(EVrange + ' is the EVrange')

    
     //manipulation of form data.
    SOC = SOC/100;
    console.log(SOC + '% is the SOC percent');

    //Subtract 10% battery power from the CBP for allowance.
    SOC = SOC-0.1;
    console.log(SOC + '% is safe SOC');

    //Using the SOC minus 10%, calculate the safe Drivable Range of the EV (DR)
    safeDrivableDistance = EVrange*SOC
    console.log(safeDrivableDistance +' miles is the safe drivable range')
 
  var location = jstart;
  geocode(location);
}

    
//start the geocoding function to get the latitude and longitude.
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
          //log the geometry
          console.log(lat);
          console.log(long);


          //locate the charging station by calling the chargestation function.
          //using the latitude and longitude.
          chargestations();

        })
        .catch(function(error){
          console.log(error);
        });
      }

  function chargestations(){
        axios.get('https://chargepoints.dft.gov.uk/api/retrieve/registry/format/json', {
            params:{
                lat: lat,
                long: long,
                dist: safeDrivableDistance
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