var map = L.map('map').setView([57.11973723727868, -2.13965135269459], 17);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiamFkb25uazUwIiwiYSI6ImNsMHgzb3IzcTFnaGIzZG41OHJpbWNhd3YifQ.iRmUKqleOXpk27nXvL-zkA'
}).addTo(map);

var LeafIcon = L.Icon.extend({
  options: {
     iconSize:     [38, 40],
     shadowSize:   [50, 64],
     iconAnchor:   [22, 94],
     shadowAnchor: [4, 62],
     popupAnchor:  [-3, -76]
  }
});

var greenIcon = new LeafIcon({
  iconUrl: 'Assets/evcharger2.png',
})

var redIcon = new LeafIcon({
  iconUrl: 'Assets/evcharger.png',
})

var jstart;
var jfinish;  
var SOC; 
var EVrange;
var charger;
var safeDrivableDistance;
var StartLat;
var StartLong;
var EndLat;
var EndLong;

  // get Journey planner Form
  const journeyForm = document.getElementById('journey');

  // add listener to the form
  journeyForm.addEventListener('submit', JourneyForm)


//getting the form data
function JourneyForm(event){
    event.preventDefault();
    console.log('form submitted');
    

    //getting the form data
    jstart   = document.getElementById('journeystart').value;
    jfinish  = document.getElementById('journeyfinish').value;
    SOC      = document.getElementById("evSOC").value;
    EVrange  = document.getElementById("EVrange").value;
    charger  = document.getElementById("charger").value;
    
    console.log(jstart + 'jstart')
    console.log(jfinish + 'jfinish')
    console.log(SOC + 'SOC')
    console.log(EVrange + 'EVrange')

    
     //manipulation of form data.
    SOC = SOC/100;
    console.log(SOC + ' %');

    //Subtract 10% battery power from the CBP for allowance.
    SOC = SOC-0.1;
    console.log(SOC + ' % is safe SOC');

    //Using the SOC minus 10%, calculate the safe Drivable Range of the EV (DR)
    safeDrivableDistance = EVrange*SOC
    console.log(safeDrivableDistance +' miles')
 
    //locate start point and run the chargestation function
  StartPoint(jstart);
  
  //Locate destination.
  EndPoint(jfinish);
}

    
        //start the geocoding function.
function StartPoint(location){
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
          StartLat = response.data.results[0].geometry.location.lat;
          StartLong = response.data.results[0].geometry.location.lng;
          
          console.log(StartLat);
          console.log(StartLong);
          L.marker([StartLat, StartLong]).addTo(map);
 
          //locate the charging station by calling the chargestation function.
          chargestations();

        })
        .catch(function(error){
          console.log(error);
        });
      }
  





      function EndPoint(location){
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
          EndLat = response.data.results[0].geometry.location.lat;
          EndLong = response.data.results[0].geometry.location.lng;
          L.marker([EndLat, EndLong], {icon: redIcon}).addTo(map);

          

        })
        .catch(function(error){
          console.log(error);
        });
      }






  function chargestations(){
        axios.get('https://chargepoints.dft.gov.uk/api/retrieve/registry/format/json', {
            params:{
                lat: StartLat,
                long: StartLong,
                dist: safeDrivableDistance
            }

        } )
        .then(function(response){
            console.log(response)
            // formatting to get stuffs

            
            // var Chargerlat = response.data.ChargeDevice[0].ChargeDeviceLocation.Latitude;
            // var ChargerLong = response.data.ChargeDevice[0].ChargeDeviceLocation.Longitude;

            // L.marker([Chargerlat, ChargerLong], {icon: greenIcon}).addTo(map);

            for(i in response.data.ChargeDevice){
              var Chargerlat = response.data.ChargeDevice[i].ChargeDeviceLocation.Latitude;
              var ChargerLong = response.data.ChargeDevice[i].ChargeDeviceLocation.Longitude;
              L.marker([Chargerlat, ChargerLong], {icon: greenIcon}).addTo(map);
            }
            matrixCal()
        })
        .catch(function(){
            console.log(error)
        })
    }

  Number.prototype.toRad = function() {
      return this * Math.PI / 180;
   }
   
   function matrixCal(){
      var lat2 = EndLat; 
      var lon2 = EndLong; 
      var lat1 = Chargerlat; 
      var lon1 = ChargerLong; 
   
      var R = 6371; // km 
        //has a problem with the .toRad() method below.
      var x1 = lat2-lat1;
      var dLat = x1.toRad();  
      var x2 = lon2-lon1;
      var dLon = x2.toRad();  
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                   Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                   Math.sin(dLon/2) * Math.sin(dLon/2);  
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; 
   
      console.log(d);
}


    

  