<?php
$db_user = "root";
$db_password = "";
$db_name = "evrp";

try{
    $db = new PDO('mysql:host=localhost; dbname='. $db_name.  ';charset=utf8', $db_user, $db_password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully";
} catch(PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}
?>