<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Falling brickz</title>
</head>
<body>
    <form method = "GET" id = "box" action="start_game.php">
        <input name = "user_name" type="text" id="username" placeholder = "enter a username" required autofocus>
        <input type="submit" value="Start">
    </form>
</body>
<style>
    @font-face{
        font-family:pixel;
        src:url("textures&font/pixel.otf");
    }
    *{
        margin: 0;
        padding: 0;
    }
    body{
        background:url(textures&font/index_background.png);   
    }
    #box{
        height:100vh;
        display:flex;
        justify-content:center;
        flex-direction:column;
        align-items:center;
    }
    #username{
        height:50px;
        text-align:center;
        font-size:50px;
        border-radius:40px;
        font-family:pixel;
        margin-bottom:80px;
        height:100px;
        color:yellowgreen;
        box-shadow:none;
        border:solid #098ee7 6px;
    }
    ::placeholder{
        color:black;
    }
    input[type="submit"]{
        font-family:pixel;
        font-size:120px;
        color:white;
        background-color:#098ee7;
        cursor:pointer;
        border:none;
        border-radius:20px;
        border:4px solid white;
        margin-top:80px;
        box-shadow:0 0 50px 7px rgb(5, 26, 54);
        transition:box-shadow 200ms ,font-size 200ms,border-radius 200ms;
    }
    input[type="submit"]:hover{
        box-shadow:0 0 50px 7px rgb(50, 156, 205);
    }
    input[type="submit"]:active{
        box-shadow:none;
        font-size:110px;
        border-radius:40px;
    }
</style>
</html>
