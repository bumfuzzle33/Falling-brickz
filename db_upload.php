<?php
$conn = new mysqli('localhost','test','password','falling_bricks');
if($conn->connect_error){
    echo $conn->connect_error;
}
if(isset($_POST['score'])){
    $score = $_POST['score'];
    $username = $_POST['username'];
    $conn -> query("insert into users values('username',$score)");
}

?>