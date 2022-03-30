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
    <div id="mySidenav" class="sidenav">
      <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>  
      
      <div class="journeydetails">
        <form id='journey' >
          <input type="text" id="journeystart" name="start" placeholder="The starting point of your trip" required>
          <input type="text" id="journeyfinish" name="finish" placeholder="Destination" required>
          <input type="text" id="evSOC" name="SOC" placeholder="Departure Charge %" required>
          <input type="text" id="EVrange" name="Vrange" placeholder="Vehicle Range" required>      
          <select id="charger" name="Charger Type" >
            <option value="rapid">Rapid Charge</option>
            <option value="fast">Fast Charge</option>
            <option value="slow">Slow Charge</option>
          </select>

          <input type="submit" value="Start Plan">
          <input type="reset" value="Reset">
        </form>
      </div>

    </div>

  <!-- Map container -->
    <div id="main">
        <div id="map"></div>
    </div>


    
</body>
</html>


<!-- leaflet js -->
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin="">
</script>

<!-- other scripts -->
<script src="map.js"></script>
<script src="journeyplanner.js"></script>
<script src="./sidenav.js"></script>
<script src="signup.js"></script>
<!-- <script>



</script> -->
