<?php
if(isset($_POST['score'])){
        $conn = new mysqli('localhost','admin','password','falling_bricks');
        $time = $_POST['time'];
        $score = $_POST['score'];
        $username = $_POST['username'];
        $bool = $_POST['bool'];
        echo $username;
        if($bool)
            $conn -> query("update users set score = $score , time = '$time' where user_name = '$username' ");
        else
            $conn -> query("insert into users values('$username',$score,'$time')");     
        $conn->close();
       
    }
?>