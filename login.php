<?php

$nis = isset($_POST['nis']) == true ? $_POST['nis'] : '';
$password= isset($_POST['password']) == true ? $_POST['password'] : '';

if(empty($nis) or empty($password)){
    echo "UserID atau Password kosong";}
else
{
// Create connection to Oracle
$conn = oci_connect("$nis", "$password", "192.168.116.1/orcl");
if (!$conn) {
   $m = oci_error();
   echo $m['message'], "\n";
   exit;
}
else {
   print "Connected to Oracle!";
}
}
// Close the Oracle connection
oci_close($conn);
?>