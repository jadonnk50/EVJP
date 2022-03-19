var map = L.map('map').setView([57.11973723727868, -2.13965135269459], 17);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiamFkb25uazUwIiwiYSI6ImNsMHgzb3IzcTFnaGIzZG41OHJpbWNhd3YifQ.iRmUKqleOXpk27nXvL-zkA'
}).addTo(map);

const api_url = 'https://chargepoints.dft.gov.uk/api/retrieve/registry/format/json';
async function getNCR() {
    const response = await fetch(api_url);
    const data = await response.json();
    console.log(data)
}

getNCR();


// L.JSON(chargepointJson).addTo(map)