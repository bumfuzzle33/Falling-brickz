<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Falling bricks</title>
    <script type="text/javascript" src="library/p5.js"></script>
    <script type="text/javascript" src="sketch.js"></script>
    <link rel="stylesheet" type="text/css" href="sketch.css">
    <!-- <script type="text/javascript" src="neon_line.js" defer></script> -->
</head>
<script>
    
</script>
<body>
    <div id="neon_display"></div>
    <div id="scoreboard"></div>
    <div id="highscore"></div>
    <a onclick = "to_db()" id = "see_scores" href="score_display.php">See Scores</a>
<?php
    $conn = new mysqli('localhost','admin','password','falling_bricks');
    if($conn->connect_error){
        echo $conn->connect_error;
    }
    //getting highscore
    $query = "select * from highscore order by highscore desc";
    $mysql_obj = $conn->query($query);
    // aka store raw
    $array = $mysql_obj->fetch_assoc();
    $highscore_display = $array['highscore'];
    // getting username and checking if it already exists
    $username = $_GET['user_name'];
    $check_username_raw = $conn->query("select * from users where user_name = '$username' ");
    $anymatch = $check_username_raw->num_rows;
    $existing_score = 0;
    if($anymatch){
        $check_username_array = $check_username_raw -> fetch_assoc();
        $existing_score = $check_username_array['score'];
    }
    //updating highscore if its greater than current highscore into the database
    if(isset($_POST['highscore'])){
        $conn = new mysqli('localhost','admin','password','falling_bricks');
        $highscore = $_POST['highscore'];
        $conn -> query("delete from highscore where highscore>=0");
        $conn -> query("insert into highscore values($highscore)");
        $conn->close();
    }
    $conn->close();
?>
<script>
    // console.log("script executing");
    var same_username_check = <?php echo json_encode($anymatch);?>;
    // console.log(same_username_check);
    var existing_score = <?php echo json_encode($existing_score);?>;
    var highscore_score = <?php echo json_encode($highscore_display); ?>;
    var username = <?php echo json_encode($_GET['user_name'],JSON_HEX_TAG); ?>;
    // neon border lines creation
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("height", window.innerHeight - 4);
    svg.setAttribute("width", window.innerWidth - 4);
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${window.innerWidth / 2 - 340} ${window.innerHeight / 2} l 0 450 l 680 0 l 0 -900 l -680 0 z`);
    svg.appendChild(path);
    document.getElementById("neon_display").appendChild(svg);
    //score alignment and display
    let scoreboard = document.getElementById("scoreboard");
    scoreboard.style.left = `${(window.innerWidth / 2 - 340) - 400}px`;
    scoreboard.innerHTML = `score  ${score}`;
    //highscore alignment and display
    // highscore_score
    let highscore = document.getElementById("highscore");
    highscore.style.left = `${window.innerWidth/2+440}px`;
    if(highscore_score==0){
        highscore.innerHTML =  `Highscore 00`;
    }
    else
        highscore.innerHTML = `Highscore ${highscore_score}`;
    let see_all_scores = document.getElementById("see_scores");
    see_all_scores.style.left = `${window.innerWidth/2+529}px`;
</script>
</body>

</html>


