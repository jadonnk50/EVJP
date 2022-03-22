<?php
require_once('config.php')
?>
  
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="./signup.css">
</head>
<body>

  <div>
    <?php
    if(isset($_POST['create'])){

      $username       = $_POST['username'];
      $email          = $_POST['email'];
      $ev             = $_POST['ev'];
      $evrange          = $_POST['evrange'];
      $psw            = $_POST['psw'];
      $pswrepeat      = $_POST['pswrepeat'];

      $sql = "INSERT INTO users (username, email, ev, evrange, psw) VALUES(?,?,?,?,?)";
      $stmtinsert = $db->prepare($sql);
      $result = $stmtinsert->execute([$username, $email, $ev, $evrange, $psw]);

      if($result){
        echo 'You are successfully registered.';
      } else{
        echo 'There were errors while storing your data.';
      }

    }
    ?>
  </div>
  <div id="id01" class="modal">
    <a href="index.php"><span class="close" title="Close Modal">&times;</span></a>
    <form class="modal-content" action="signup.php" method="post">
    <div class="container">
      <h1>Sign Up</h1>
      <p>Please fill in this form to create an account.</p>
      <hr>
      <label for="username"><b>Username</b></label>
      <input type="text" placeholder="Enter Username" name="username" required>

      <label for="email"><b>Email</b></label>
      <input type="email" placeholder="Enter Email" name="email" required>

      <label for="ev"><b>Whats your EV</b></label>
      <input type="text" placeholder="Enter your EV" name="ev" required>

      <label for="evrange"><b>Whats your EV's Range</b></label>
      <input type="number" placeholder="Enter your EV known Range" name="evrange" required>

      <label for="psw"><b>Password</b></label>
      <input type="password" placeholder="Enter Password" name="psw" required>

      <label for="pswrepeat"><b>Repeat Password</b></label>
      <input type="password" placeholder="Repeat Password" name="pswrepeat" required>
      
      <label>
        <input type="checkbox" checked="checked" name="remember" style="margin-bottom:15px"> Remember me
      </label>

      <!-- <input type= "submit" name= "create" value="Sign Up"> -->

      <p>By creating an account you agree to our <a href="#" style="color:dodgerblue">Terms & Privacy</a>.</p>

      <div class="clearfix">
        <button type="button" onclick="document.getElementById('id01').style.display='none'" class="cancelbtn">Log in Instead</button>
        <button type="submit" name="create" class="signupbtn">Sign Up</button>
      </div>
    </div>
  </form>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script type="text/javascript">
  $(function(){
    alert('Hello');
    console.log("hello");
  });
</body>
</html>
