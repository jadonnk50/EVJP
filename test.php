<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    

    <script>
        // geocode();

        // function geocode(){
        //     var distance = 0.5
        //     var longitude = -2.138283
        //     var latitude = 57.1189654
        //     axios.get('https://chargepoints.dft.gov.uk/api/retrieve/registry/format/json', {
        //         params:{
        //             lat: latitude,
        //             long: longitude,
        //             dist: distance,
        //         }

        //     } )
        //     .then(function(response){
        //         console.log(response)

        //         // formating to get stuffs
        //         console.log(response.data.ChargeDevice[0].ChargeDeviceLocation.Latitude)
        //         console.log(response.data.ChargeDevice[0].ChargeDeviceLocation.Longitude)

        //         // formating to get stuffs
        //         var Chargerlat = response.data.ChargeDevice[2].ChargeDeviceLocation.Latitude
        //         var ChargerLong = response.data.ChargeDevice[2].ChargeDeviceLocation.Longitude

        //         L.marker([Chargerlat, ChargerLong]).addTo(map);
        //         // var ChargerlatOutput = `
                
        //         // `;
        //     })
        //     .catch(function(){
        //         console.log(error)
        //     })
        // }

        async function chargestations(){

const myRequest = new Request('https://chargepoints.dft.gov.uk/api/retrieve/registry/format/json', {
  lat: 51.54558,
  long: -0.077301,
  dist: 1,
});

  const res = await fetch(Request)
          const data = await res.json();
              console.log(data);
      }

      chargestations()

        </script>
</body>
</html>