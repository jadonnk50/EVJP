<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EV Journey Planner</title>

    <link href="https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.css" rel="stylesheet">
    
  <!-- leaflet css -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""/>

   <!-- <bootstrap> -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
 
    <!-- <link rel="stylesheet" href="./signup.css"> -->
    <link rel="stylesheet" href="style.css"/>
    <link rel="stylesheet" href="navbar.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
</head>

<body>

  <!-- Top Navigation Bar -->
    <div class="topnav" id="myTopnav">
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <a href="signup.php">Sign Up</a>
        <a href="signup.php">Log In</a>
        <a href="javascript:void(0);" class="icon" onclick="myFunction()"><i class="fa fa-bars"></i></a>
        <button onclick="openNav()"> Plan Journey</button>
    </div>

  <!-- input field -->
    <div id="mySidenav" class="sidenav" >
      <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>  
      
      <section id="form">
        <div class="journeydetails">
          <form id='journey' >
          <div class="input-group input-group-sm mb-1">
              <span class="input-group-text" id="inputGroup-sizing-sm"><i class="bi bi-geo-alt me-1"></i></span>
              <input type="text" id="journeystart" class="form-control" placeholder="Start Address or Post Code" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" required>
          </div>
          <div class="input-group input-group-sm mb-1">
              <span class="input-group-text" id="inputGroup-sizing-sm"><i class="bi bi-geo-alt-fill me-1"></i></span>
              <input type="text" id="journeyfinish" class="form-control" placeholder="Destination Address or Post Code" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" required>
          </div>
          <div class="input-group input-group-sm mb-1">
              <span class="input-group-text" id="inputGroup-sizing-sm"><i class="bi bi-battery-half me-1"></i></span>
              <input type="text" id="evSOC" class="form-control" placeholder="Departure Battery Charge in %" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" required>
          </div>
          <div class="input-group input-group-sm mb-1">
              <span class="input-group-text" id="inputGroup-sizing-sm"><i class="bi bi-arrow-right-circle-fill me-1"></i></span>
              <input type="text" id="EVrange" class="form-control" placeholder="EV Range (in Miles)" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" required>
          </div>
          <div class="input-group input-group-sm mb-1">
              <span class="input-group-text" id="inputGroup-sizing-sm"><i class="bi bi-battery-full me-1"></i></span>
              <input type="text" id="evBatterySize" class="form-control" placeholder="EV Battery Capacity (in kWh)" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" required>
          </div>
          <div class="input-group input-group-sm mb-1">
              <span class="input-group-text" id="inputGroup-sizing-sm"><i class="bi bi-stopwatch-fill me-1"></i></span>
              <input type="text" id="chargeDUration" class="form-control" placeholder="Preferred Charge Duration (in Minutes)" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" required>
          </div>
          <div class="input-group input-group-sm mb-1">
              <label class="input-group-text" for="inputGroupSelect01"><i class="bi bi-plug-fill me-1"></i></label>
              <select class="form-select" id="charger" name="Charger Type" id="inputGroupSelect01">  
                <option value="50">Fastest Charger Available</option>
                <option value="22">Rapid Charge (22kWh)</option>
                <option value="7">Fast Charge (7kWh)</option>
              </select>
          </div>

              <input type="submit" value="Start Plan">
              <input type="submit" value="Refresh" onClick="refresh(this)">
          </form>
        </div>
      </section>

    <div id="container">
    <div id="replant" onClick="replan()"> Plan New Journey </div>
          <figure class="text-center">
                <blockquote class="blockquote">
                          <p>Journey Details</p>
                </blockquote>
                <div>
                  <p id="displayDetails"><strong>0:0:0</strong></p>
                </div>
                <figcaption class="blockquote-footer">
                  click on Charge Station or Route for more details.
                </figcaption>
          </figure> 
          <div class="container mt-2" id="accordionEmmanuel"></div>
          
    </div>

    </div>

  <!-- Map container -->
    <div id="main">
        <div id="map"></div>
    </div>

    <!-- bootstrap js -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
</body>
</html>


<!-- leaflet js -->
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin="">
</script>

<script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<!-- <script src="sweetalert2.all.min.js"></script> -->

<!-- other scripts -->
<script src="map.js"></script>
<script src="journeyplanner.js"></script>
<script src="./sidenav.js"></script>
<script src="signup.js"></script>
<script>
  function refresh(){
    document.getElementById('journey').reset()
      }

  function replan(){
    document.getElementById("form").style.display = "block";
    document.getElementById("replant").style.display = "none";
      }
</script>
