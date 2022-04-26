var map = L.map('map').setView([57.11973723727868, -2.13965135269459], 17);

mapTiler = L.tileLayer(
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      'pk.eyJ1IjoiamFkb25uazUwIiwiYSI6ImNsMHgzb3IzcTFnaGIzZG41OHJpbWNhd3YifQ.iRmUKqleOXpk27nXvL-zkA',
  }
)

mapTiler.addTo(map);

var LeafIcon = L.Icon.extend({
  options: {
    iconSize: [38, 40],
  },
});

var greenIcon = new LeafIcon({
  iconUrl: 'Assets/evcharger2.png',
  popupAnchor: [-1, 3],
});

var redIcon = new LeafIcon({
  iconUrl: 'Assets/evcharger.png',
});

var TransparentIcon = new LeafIcon({
  iconUrl: 'Assets/evcharger3.png',
})

var jstart;
var jfinish;  
var SOC; 
var EVrange;
var charger;
var safeDrivableDistance;
var evDrivableDistance;
var StartLat;
var StartLong;
var EndLat;
var EndLong;
var chargerSpeed;
var chargingDuration;
var evBatterySize
var chargeLat;
var chargeLong;
var finalCs;
var totalDistance =0;
var totalMinute =0;
var displayMinute;
var journeyData = 1;
var driveMinute = 0;
var  displayDriveMinute;
var chargeMinute = 0;
var  displayChargeMinute; 


// get Journey planner Form
const journeyForm = document.getElementById('journey');

// add listener to the form
journeyForm.addEventListener('submit', JourneyForm);

//getting the form data
function JourneyForm(event) {
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
    
    // document.getElementById('journey').reset();

   //manipulation of form data.
    SOC = SOC/100;

    evDrivableDistance = EVrange*SOC
    //Subtract 10% battery power from the CBP for allowance.
    SOC = SOC-0.1;

    //calculate the safe Drivable Range of the EV (DR) using the SOC minus 10%.
    safeDrivableDistance = EVrange*SOC

    //preferred duration divided by 60 to get the time in hours.
    chargingDuration = chargingDuration/60;
  
      var parent = document.getElementById("accordionEmmanuel");
      parent.innerHTML ='';

      totalDistance = 0;
      totalMinute =0;
      driveMinute = 0;
      chargeMinute = 0;
      journeyData = 1;
      
    

    newMapLayer();
}

//Geocode the start point and locate it on the map
async function StartPoint(location) {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json', 
      {
      params: {
        address: location,
        key: 'AIzaSyAKf5i0oElPYrydoQFUiu5k7oBUrR2oIys',
      },
    }
    );

      // get the Geometry
      StartLat = response.data.results[0].geometry.location.lat;
      StartLong = response.data.results[0].geometry.location.lng;
      var FormattedAd = response.data.results[0].formatted_address;
      startPointGeo = [StartLat, StartLong];

      L.marker([StartLat, StartLong],
        {
        draggable: true,
        title: "Start Point",
      }).addTo(map)
      .bindPopup(FormattedAd);

    
      return startPointGeo;
    }catch (error) {
    throw error.message;
  }
}


//Geocode the end point and locate it on the map
async function EndPoint(location) {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json', 
      {
        params: {
        address: location,
        key: 'AIzaSyAKf5i0oElPYrydoQFUiu5k7oBUrR2oIys',
        },
      }
    );

      // get the Geometry
    EndLat = response.data.results[0].geometry.location.lat;
    EndLong = response.data.results[0].geometry.location.lng;
    var FormattedAd = response.data.results[0].formatted_address;
    endPointGeo = [EndLat, EndLong]

    L.marker([EndLat, EndLong], {
        icon: redIcon,
        draggable: true,
        title: "End Point",
      }).addTo(map)
      .bindPopup(FormattedAd);

      return endPointGeo

  } catch (error) {
    throw error.message;
  }
}



//add new map layer

async function newMapLayer(){
  try{
    map.remove();

    map = L.map('map').setView([57.11973723727868, -2.13965135269459], 17);
    mapTiler.addTo(map);
  
  var startPointGeo= await StartPoint(jstart);
  var endPointGeo = await EndPoint(jfinish);

    startPointGeo = L.latLng(startPointGeo);
    endPointGeo = L.latLng(endPointGeo);
    bounds = L.latLngBounds(startPointGeo, endPointGeo);

 map.fitBounds(
    bounds, 
    { 
      padding: [50, 50] 
    }
  );

  //call the matrix api to calculate the journey distance: between the start point and end point
 let journeyDistance =  await matrixAPIcall(jstart, jfinish);

 if (journeyDistance <= safeDrivableDistance){
  
  routeAPIcall(jstart, jfinish);

    Swal.fire(
      'EV Charge Sufficient!',
      'Your EV can complete this journey without a stop',
      'success'
    )
 // run the routing function
 } else if (journeyDistance > safeDrivableDistance)
  {
   while (journeyDistance > safeDrivableDistance)
   {
    document.getElementById("form").style.display = "none";
    document.getElementById("replant").style.display = "block";

//     const itineraryDiv = document.getElementById('accordionEmmanuel');
//     const createDiv = document.createElement('div')
//     createDiv.classList.add("mb-3")
//     createDiv.innerHTML = `
//         <div class="accordion pb-0"><i class="bi bi-battery-charging me-1"></i>${jstart}
//             <div class="text-end fs-6 fw-lighter text-muted" style="pointer-events: none;">
//             <small><i class="bi bi-battery-half me-1"></i>${SOC}%</small>
//             </div>  
//       </div>
// `

    let chargePoint = await chargestations();
    journeyDistance = await matrixAPIcall(chargePoint, jfinish);

    finalCs = chargePoint
    journeyData++;
   }
   routeAPIcall(finalCs, jfinish);
 }
  } catch (error) {
  throw error.message;
  }
}





// Function to get charge station by its ID
async function getMinimumCS(chargeStationId) {
  try {
    const response = await axios.get(
      'https://chargepoints.dft.gov.uk/api/retrieve/registry/format/json',
      {
        params: {
          'device-id': chargeStationId,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
}


//ChargeStations function that will calculate the closest chargestation to the destination and locate it on the map
async function chargestations() {
  try {
    const response = await axios.get(
      'https://chargepoints.dft.gov.uk/api/retrieve/registry/format/json',
      {
        params: {
          lat: StartLat,
          long: StartLong,
          dist: safeDrivableDistance,
          'rated-output-kw':charger,
        },
      }
    );
    
    
    let distance = [];

    for (i in response.data.ChargeDevice) {
      const toRad = (number) => number * (Math.PI / 180);

      var lat2 = EndLat;
      var lon2 = EndLong;
      var lat1 = response.data.ChargeDevice[i].ChargeDeviceLocation.Latitude;
      var lon1 = response.data.ChargeDevice[i].ChargeDeviceLocation.Longitude;
     
      var R = 3958.8; // miles
      var x1 = lat2 - lat1;
      var dLat = toRad(x1);
      var x2 = lon2 - lon1;
      var dLon = toRad(x2);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;

      distance.push({
        lat: lat1,
        long: lon1,
        miles: d,
        csID: response.data.ChargeDevice[i].ChargeDeviceId,
      });
    }

    let min = Math.min(...distance.map((item) => item.miles));
    let getMinimum = distance.filter((item) => item.miles === min)[0];

    var actualChargeStation = await getMinimumCS(getMinimum.csID);
    var chargeSt = actualChargeStation.ChargeDevice[0];
    var ChargeDeviceName = chargeSt.ChargeDeviceName;
    var ChargeDeviceStreet = chargeSt.ChargeDeviceLocation.Address.Street;
    var ChargeDevicePostCode = chargeSt.ChargeDeviceLocation.Address.PostCode;
    var ChargeDevicePostTown = chargeSt.ChargeDeviceLocation.Address.PostTown;
    var ChargeDeviceStatus = chargeSt.ChargeDeviceStatus;
    var numberOfConnectors = chargeSt.Connector.length;
    var ConnectorRatedOutputkW = [];
      for (var i = 0; i < numberOfConnectors; i++) {
        ConnectorRatedOutputkW.push(chargeSt.Connector[i].RatedOutputkW)
      }
    chargerSpeed = Math.max(...ConnectorRatedOutputkW)

    chargeLat = getMinimum.lat;
    chargeLong = getMinimum.long;

    let initialPoint = [StartLat, StartLong];
    initialPoint = initialPoint.toString()
    let chargePoint = [chargeLat,chargeLong];
    chargePoint = chargePoint.toString();

    L.marker([chargeLat, chargeLong], {
      icon: greenIcon
    }).addTo(map)
    .bindPopup(`
    <div>
      <div><strong>${ChargeDeviceName}</strong></div>
      <div>${ChargeDeviceStreet}, ${ChargeDevicePostCode}</div>
      <div>${ChargeDevicePostTown}</div>
      <div>Status: ${ChargeDeviceStatus}</div>
      <div>${numberOfConnectors} Connectors</div>
      <div>Avail KWh: ${ConnectorRatedOutputkW}</div>
    </div>
    `);
    let csDuration = chargeDuration();
    let batteryPercent = csDuration.batteryPercent;
    let stopDuration = csDuration.remainder;
    let connectorKWh = csDuration.chargerSpeed; 

    routeAPIcall(initialPoint, chargePoint)

    const itineraryDiv = document.getElementById('accordionEmmanuel');
    const createDiv = document.createElement('div')
    createDiv.classList.add("mb-3")
    createDiv.innerHTML = `
        <div class="accordion pb-0" onclick="accordion(event)" data-id="${journeyData}"><i class="bi bi-battery-charging me-1"></i>${ChargeDeviceName}
            <div class="text-end fs-6 fw-lighter text-muted" style="pointer-events: none;">
            <small class="me-2"><i class="bi bi-plug-fill me-1"></i>${connectorKWh}kWh</small>        
            <small class="me-2"><i class="bi bi-stopwatch me-1"></i>${stopDuration} mins.</small>  
            <small><i class="bi bi-arrow-up"></i><i class="bi bi-battery-half me-1"></i>${batteryPercent}%</small>
            </div>
        </div>
          <div class="panel p${journeyData}">
          <small><i class="bi bi-geo-fill me-1"></i>${ChargeDevicePostCode}, ${ChargeDevicePostTown}</small><br>
          <small><i class="bi bi-check-circle-fill me-1"></i><strong>Status:</strong> ${ChargeDeviceStatus}</small><br>
          <small><i class="bi bi-plug-fill me-1"></i>${numberOfConnectors} Connectors</small><br>
          <small><i class="bi bi-lightning-charge-fill me-1"></i><strong>Avail KWh:</strong> ${ConnectorRatedOutputkW}</small><br>  
      </div>
`
    itineraryDiv.appendChild(createDiv)
    

  
    return chargePoint;
    
  } catch (error) {
    throw error.message;
  }
}

//Calculate the preferred time to be spent on each charging station and how it affects the next distance.
function chargeDuration() {
  chargerSpeed; //from the CS charging RatedOutput in KWh (Kilowatts per Hour)
      
  //the replenish Charge will
  let batteryReplenished = chargerSpeed * chargingDuration;
  

      //percentage replenished is calculated here: 
  let percentageReplenished =batteryReplenished/evBatterySize;

  let remainder = chargingDuration * 60;
  if (percentageReplenished > 0.9){
    remainder = percentageReplenished - 0.9;
    remainder = remainder*evBatterySize;
    remainder = remainder/chargerSpeed;
    remainder = 1-remainder;
    remainder = remainder*60;
    remainder = Math.floor(remainder);
    percentageReplenished = 0.9;
  }
  let batteryPercent = (percentageReplenished + 0.1) * 100;
  batteryPercent = Math.floor(batteryPercent);
  
  let chargeDurationData = {chargerSpeed, batteryPercent, remainder};
  totalMinute+=(remainder*60);
  chargeMinute+=(remainder*60);

  StartLat = chargeLat;
  StartLong = chargeLong;
  safeDrivableDistance = percentageReplenished * EVrange;

  return chargeDurationData;
}


async function matrixAPIcall(origins, destinations){
      try {
      const response = await axios.get(
        'http://www.mapquestapi.com/directions/v2/route', 
        {
          params: {
            key: 'GDt292YcfGH8Pj8J3UNYMLKhFJOC0kUL',
            from: origins,
            to: destinations,
          },
        }
      );
      let distDifference = response.data.route.distance;
    
    return distDifference

  } catch (error) {
    throw error.message;
  }
}

async function routeAPIcall(origins, destinations){
  try {
    const response = await axios.get(
      'http://www.mapquestapi.com/directions/v2/route', 
      {
        params: {
          key: 'GDt292YcfGH8Pj8J3UNYMLKhFJOC0kUL',
          from: origins,
          to: destinations,
        },
      }
    );

    let seconds = response.data.route.time;
    let distance = response.data.route.distance;
    let destNarrative = response.data.route.legs[0].destNarrative;
    let duration = response.data.route.legs[0].formattedTime;
    let turns = response.data.route.legs[0].maneuvers.length
    let route = [];
    for (var i = 0; i < turns; i++) {
      route.push(response.data.route.legs[0].maneuvers[i].startPoint)
    }

    
    totalDistance+=parseFloat(distance);
    totalDistance =Math.round(totalDistance);
    totalMinute+=parseFloat(seconds);
    driveMinute +=parseFloat(seconds);
    displayMinute = convertHMS(totalMinute);
    displayDriveMinute = convertHMS(driveMinute)
    displayChargeMinute = convertHMS(chargeMinute);
  
    var displayStuff = document.getElementById("displayDetails");
      displayStuff.innerHTML =`
      <p>
      <strong>
      <i class="fa fa-car me-2" aria-hidden="true"></i>${totalDistance} mi  <i class="bi bi-stopwatch mx-2 me-1"></i>${displayMinute}
      </strong><br>
      <small><i class="fa fa-car me-2" aria-hidden="true"></i>${displayDriveMinute}  <i class="bi bi-lightning-charge-fill mx-2 me-1"></i> ${displayChargeMinute} - <i class="bi bi-lightning-charge-fill me-1"></i>${journeyData -1} stops</small>
      </p>
      `;

    var latlngs = route;
    var polyline = L.polyline(latlngs, {color: 'purple'}).addTo(map).bindPopup(`
    <div>
      <div><strong> ${destNarrative} </strong></div>
      <div>Duration: Hr ${duration} Sec</div>
      <div>Distance: ${distance} mi</div>
    </div>
    `).openPopup();

    


  } catch (error) {
    throw error.message;
  }
}


function accordion(e) {
  var dataId = e.target.getAttribute("data-id");
  var elem = document.querySelector(".p"+dataId);
  if (elem.style.display === "none") {
            elem.style.display = "block";
            } else {
            elem.style.display = "none";
            }
}


function convertHMS(value) {
  const sec = parseInt(value, 10); // convert value to number if it's string
  let hours   = Math.floor(sec / 3600); // get hours
  let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
  let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours+'h:'+minutes+'m:'+seconds +'s'; // Return is HH : MM : SS
}
  