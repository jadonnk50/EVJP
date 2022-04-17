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
     popupAnchor:  [-3, -76]
  }
});

var greenIcon = new LeafIcon({
  iconUrl: 'Assets/evcharger2.png',
})

var redIcon = new LeafIcon({
  iconUrl: 'Assets/evcharger.png',
})

var TransparentIcon = new LeafIcon({
  iconUrl: 'Assets/evcharger3.png',
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
var chargerSpeed;
var chargingDuration;
var evBatterySize
var chargeLat;
var chargeLong;

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
    evBatterySize  = document.getElementById("evBatterySize").value;
    EVrange  = document.getElementById("EVrange").value;
    charger  = document.getElementById("charger").value;
    chargingDuration  = document.getElementById("chargeDUration").value;
    console.log(jstart + ' is start, '+ jfinish + ' is finish, ' + SOC + '% is departure charge, ' + EVrange + ' miles is EVrange, ' + evBatterySize  + " is EV battery size " + chargingDuration + ' is Charge Duration, '+ charger + " is Chosen Charger ")
  
     //manipulation of form data.
    SOC = SOC/100;
    //Subtract 10% battery power from the CBP for allowance.
    SOC = SOC-0.1;

    //calculate the safe Drivable Range of the EV (DR) using the SOC minus 10%.
    safeDrivableDistance = EVrange*SOC
    console.log(safeDrivableDistance +' miles is the safe Drivable Range')

    //preferred duration divided by 60 to get the time in hours.
    chargingDuration = chargingDuration/60; 

 
    //locate start point and run the chargestation function
  StartPoint(jstart);
  
  //Locate destination.
  EndPoint(jfinish);
}

    
        //Geocode the start point and locate it on the map
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
          console.log(StartLat , StartLong + " Start Lat and Long");
          L.marker([StartLat, StartLong]).addTo(map);
 
          //locate the charging stations by calling the chargestation function.
          chargestations();
        })
        .catch(function(error){
          console.log(error);
        });
      }
  

      //Geocode the end point and locate it on the map
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
          console.log(EndLat , EndLong + " Destination Lat and Long");
          L.marker([EndLat, EndLong], {icon: redIcon}).addTo(map);
        })
        .catch(function(error){
          console.log(error);
        });
      }





      //ChargeStations function that will calculate the closest chargestation to the destination and locate it on the map
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

            // for(i in response.data.ChargeDevice){
            //   var Chargerlat = response.data.ChargeDevice[i].ChargeDeviceLocation.Latitude;
            //   var ChargerLong = response.data.ChargeDevice[i].ChargeDeviceLocation.Longitude;
            //   L.marker([Chargerlat, ChargerLong], {icon: TransparentIcon}).addTo(map);
            // }

            var distance = [];

            for(i in response.data.ChargeDevice){
              const toRad = (number) => number * (Math.PI/180)
              
              var lat2 = EndLat; 
              var lon2 = EndLong; 
              var lat1 = response.data.ChargeDevice[i].ChargeDeviceLocation.Latitude;
              var lon1 = response.data.ChargeDevice[i].ChargeDeviceLocation.Longitude;
              // var ChargeDeviceName = response.data.ChargeDevice[i].ChargeDeviceName;
              // var ChargeDeviceStatus = response.data.ChargeDevice[i].ChargeDeviceStatus;
              // var numberOfConnectors =response.data.ChargeDevice[i].Connector.length;
              // var ConnectorRatedOutputkW = [];
              //   for (var i = 0; i < numberOfConnectors; i++){
              //     ConnectorRatedOutputkW.push (response.data.ChargeDevice[i].Connector[i].RatedOutputkW)
              //   };
              

              var R = 3958.8; // miles 
              var x1 = lat2-lat1;
              var dLat = toRad(x1);  
              var x2 = lon2-lon1;
              var dLon = toRad(x2);  
              var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
                      Math.sin(dLon/2) * Math.sin(dLon/2);  
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
              var d = R * c;
              
              distance.push({ lat: lat1, long: lon1, miles: d, csID: response.data.ChargeDevice[i].ChargeDeviceId})
            }

          //   distance.push( { lat: lat1, long: lon1, miles: d, chargeDeviceName: ChargeDeviceName, ChargeDeviceStatus: ChargeDeviceStatus, ConnectorRatedOutputkW: ConnectorRatedOutputkW, AvailableConnectors: numberOfConnectors})
          // }

            let min = Math.min(...distance.map(item => item.miles))
            let getMinimum = distance.filter(item => item.miles === min)[0]
            console.log(getMinimum);
            
            function getMinimumCS(chargeStationId){
              return axios.get('https://chargepoints.dft.gov.uk/api/retrieve/registry/format/json', {
                    params:{
                      'device-id': chargeStationId,
                    }
        
                } )
                .then(function(response){
                    console.log(response.data)

                    return response.data
        
                  })
                  .catch(function(error){
                      console.log(error)
                  })
            }
            
            var actualChargeStation = getMinimumCS(getMinimum.csID)[0]
            console.log(actualChargeStation)

            // var lat1 = actualChargeStation.ChargeDeviceLocation.Latitude;
            // var lon1 = actualChargeStation.ChargeDeviceLocation.Longitude;
            // var ChargeDeviceName = response.data.ChargeDevice[i].ChargeDeviceName;
            // var ChargeDeviceStatus = response.data.ChargeDevice[i].ChargeDeviceStatus;
            // var numberOfConnectors =response.data.ChargeDevice[i].Connector.length;
            // var ConnectorRatedOutputkW = [];
            //     for (var i = 0; i < numberOfConnectors; i++){
            //       ConnectorRatedOutputkW.push (response.data.ChargeDevice[i].Connector[i].RatedOutputkW)
            //     };
            // chargerSpeed = Math.max(...getMinimum.ConnectorRatedOutputkW)
            // console.log(chargerSpeed)
            // chargeLat = getMinimum.lat;
            // chargeLong = getMinimum.long;
            // L.marker([chargeLat, chargeLong], {icon: greenIcon}).addTo(map)           


            chargeDuration();
        })
        .catch(function(error){
            console.log(error)
        })
    }

    //using the preferred charging duration calculate the replenished battery power
    function chargeDuration(){
      chargerSpeed; //from the CS charging RatedOutput in KWh (Kilowatts per Hour)
      //the replenish Charge will
      var batteryReplenished = chargerSpeed * chargingDuration;
      console.log(chargingDuration + "hours");
      console.log(batteryReplenished + "kWh");

      //percentage replenished is: 
      var percentageReplenished =batteryReplenished/evBatterySize;
      console.log(percentageReplenished * 100 + '% is percentage charged')

      StartLat = chargeLat;
      StartLong = chargeLong;
      safeDrivableDistance = percentageReplenished * EVrange;
      chargestations()
    }

  
    