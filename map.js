// var map = L.map('map').setView([57.11973723727868, -2.13965135269459], 17);

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: 'pk.eyJ1IjoiamFkb25uazUwIiwiYSI6ImNsMHgzb3IzcTFnaGIzZG41OHJpbWNhd3YifQ.iRmUKqleOXpk27nXvL-zkA'
// }).addTo(map);

// var LeafIcon = L.Icon.extend({
//   options: {
//      iconSize:     [38, 40],
//      popupAnchor:  [-3, -76]
//   }
// });

// var greenIcon = new LeafIcon({
//   iconUrl: 'Assets/evcharger2.png',
// })

// var redIcon = new LeafIcon({
//   iconUrl: 'Assets/evcharger.png',
// })

// var jstart;
// var jfinish;  
// var SOC; 
// var EVrange;
// var charger;
// var safeDrivableDistance;
// var StartLat;
// var StartLong;
// var EndLat;
// var EndLong;

//   // get Journey planner Form
//   const journeyForm = document.getElementById('journey');

//   // add listener to the form
//   journeyForm.addEventListener('submit', JourneyForm)


// //getting the form data
// function JourneyForm(event){
//     event.preventDefault();
//     console.log('form submitted');
    

//     //getting the form data
//     jstart   = document.getElementById('journeystart').value;
//     jfinish  = document.getElementById('journeyfinish').value;
//     SOC      = document.getElementById("evSOC").value;
//     EVrange  = document.getElementById("EVrange").value;
//     charger  = document.getElementById("charger").value;
    
//     console.log(jstart + 'jstart')
//     console.log(jfinish + 'jfinish')
//     console.log(SOC + 'SOC')
//     console.log(EVrange + 'EVrange')

    
//      //manipulation of form data.
//     SOC = SOC/100;
//     console.log(SOC + ' %');

//     //Subtract 10% battery power from the CBP for allowance.
//     SOC = SOC-0.1;
//     console.log(SOC + ' % is safe SOC');

//     //Using the SOC minus 10%, calculate the safe Drivable Range of the EV (DR)
//     safeDrivableDistance = EVrange*SOC
//     console.log(safeDrivableDistance +' miles')
 
//     //locate start point and run the chargestation function
//   StartPoint(jstart);
  
//   //Locate destination.
//   EndPoint(jfinish);
// }

    
//         //Geocode the start point and locate it on the map
// function StartPoint(location){
//         axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
//           params:{
//             address:location,
//             key:'AIzaSyAKf5i0oElPYrydoQFUiu5k7oBUrR2oIys'
//           }
//         })
//         .then(function(response){
//           // Log full response
//           console.log(response);
  
//           // get the Geometry
//           StartLat = response.data.results[0].geometry.location.lat;
//           StartLong = response.data.results[0].geometry.location.lng;
          
//           console.log(StartLat);
//           console.log(StartLong);
//           L.marker([StartLat, StartLong]).addTo(map);
 
//           //locate the charging stations by calling the chargestation function.
//           chargestations();
//         })
//         .catch(function(error){
//           console.log(error);
//         });
//       }
  

//       //Geocode the end point and locate it on the map
//       function EndPoint(location){
//         axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
//           params:{
//             address:location,
//             key:'AIzaSyAKf5i0oElPYrydoQFUiu5k7oBUrR2oIys'
//           }
//         })
//         .then(function(response){
//           // Log full response
//           console.log(response);
  
//           // get the Geometry
//           EndLat = response.data.results[0].geometry.location.lat;
//           EndLong = response.data.results[0].geometry.location.lng;
//           L.marker([EndLat, EndLong], {icon: redIcon}).addTo(map);
//         })
//         .catch(function(error){
//           console.log(error);
//         });
//       }





//       //ChargeStations function that will calculate the closest chargestation to the destination and locate it on the map
//   function chargestations(){
//         axios.get('https://chargepoints.dft.gov.uk/api/retrieve/registry/format/json', {
//             params:{
//                 lat: StartLat,
//                 long: StartLong,
//                 dist: safeDrivableDistance
//             }

//         } )
//         .then(function(response){
//             console.log(response)
//             // formatting to get stuffs

//             // for(i in response.data.ChargeDevice){
//             //   var Chargerlat = response.data.ChargeDevice[i].ChargeDeviceLocation.Latitude;
//             //   var ChargerLong = response.data.ChargeDevice[i].ChargeDeviceLocation.Longitude;
//             //   L.marker([Chargerlat, ChargerLong], {icon: greenIcon}).addTo(map);
//             // }

//             var distance = [];

//             for(i in response.data.ChargeDevice){
//               const toRad = (number) => number * (Math.PI/180)
              
//               var lat2 = EndLat; 
//               var lon2 = EndLong; 
//               var lat1 = response.data.ChargeDevice[i].ChargeDeviceLocation.Latitude;
//               var lon1 = response.data.ChargeDevice[i].ChargeDeviceLocation.Longitude;
//               var ChargeDeviceName = response.data.ChargeDevice[i].ChargeDeviceName;
//               var ChargeDeviceStatus = response.data.ChargeDevice[i].ChargeDeviceStatus;
//               var numberOfConnectors =response.data.ChargeDevice[i].Connector.length;
//               var ConnectorRatedOutputkW = [];
//                 for (var i = 0; i < numberOfConnectors; i++){
//                   var ConnectorRatedOutputkW = response.data.ChargeDevice[i].Connector[i].RatedOutputkW;
//                   console.log(myStringArray[i]);
//                     //Do something
//                 }};

//               var R = 3958.8; // miles 
//               var x1 = lat2-lat1;
//               var dLat = toRad(x1);  
//               var x2 = lon2-lon1;
//               var dLon = toRad(x2);  
//               var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
//                       Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
//                       Math.sin(dLon/2) * Math.sin(dLon/2);  
//               var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//               var d = R * c;
              
//               distance.push( { lat: lat1, long: lon1, miles: d, chargeDeviceName: ChargeDeviceName, ChargeDeviceStatus: ChargeDeviceStatus, ConnectorRatedOutputkW: ConnectorRatedOutputkW, AvailableConnectors: numberOfConnectors})
//             }
//             console.log(distance);

//             let min = Math.min(...distance.map(item => item.miles))
//             let getMinimum = distance.filter(item => item.miles === min)[0]
//             console.log(getMinimum);

//             L.marker([getMinimum.lat, getMinimum.long], {icon: greenIcon}).addTo(map)            
//         })
//         .catch(function(error){
//             console.log(error)
//         })
//     }

//     //Calculate the preferred time to be spent on each charging station and how it affects the next distance.
//     function chargeDuration(){
//       var chargerSpeed;
//       var chargingDuration;
//     }

  