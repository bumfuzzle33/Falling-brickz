<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel = "stylesheet" type = "text/css" href = "score_display.css">
</head>
<body>
<!-- connecting to the server -->
<?php
    $conn = new mysqli('localhost','test','password','falling_bricks');
    if($conn->connect_error)
        echo $conn->connect_error;
    $query = "select * from users order by score desc,time asc";
    $store_raw = $conn->query($query);
    $conn -> close();
?>
<table>
  <tr>
    <th>User name</th>
    <th>Score</th>
    <th>Time (s)</th>
  </tr>
  <!-- using kind of a trim technique to get all the results -->
    <?php
        while($result = $store_raw->fetch_assoc()){ 
    ?>
    <tr>
        <td>
            <?php echo $result['user_name']; ?>
        </td>
        <td>
            <?php echo $result['score']; ?>
        </td>
        <td>
            <?php echo $result['time']; ?>
        </td>
    </tr>
    <?php }?>
</table> 
</body>
</html>