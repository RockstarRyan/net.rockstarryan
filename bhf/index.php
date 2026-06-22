<!DOCTYPE html>
<html><head>
    <?php 

    $path = $_SERVER['REQUEST_URI'];
    $requested_puzzle = intval(explode('/',$path)[2]);
    if (is_int($requested_puzzle)) {
        if (!($requested_puzzle>=1 && $requested_puzzle<=6)) {
            echo "Error: invalid URL (invalid puzzle number). Try again.";
            exit(0);
        }
    } else {
        echo "Error: invalid URL (not integer). Try again.";
        exit(0);
    }

    $current_puzzle = $requested_puzzle;

    ?>
    <title>Puzzle #<?php echo $current_puzzle; ?> &ndash; Brighthouse Financial Puzzles</title>
    <meta charset="UTF-8">
	<meta name="description" content="Puzzle #<?php echo $current_puzzle; ?> of the Brighthouse Financial Puzzles series">
	<meta name="keywords" content="">
	<meta name="author" content="Ryan Gross">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

		body {font-family:"Roboto", "SF-Pro", "Arial", sans-serif; background-color:#ffffff; color:#000; display:flex; flex-flow:column nowrap; justify-content:center; margin:0; padding:0; text-align:center;}
        body.solved {background-color:#000; color:#fff;}
        a {color:rgb(121,172,0);}
        p {font-size:24px;}
        #bhf-logo {background-image: linear-gradient(to right, rgb(0, 141, 148) 0px, rgb(0, 141, 148) 20%, rgb(30, 149, 111) 20%, rgb(30, 149, 111) 40%, rgb(49, 146, 83) 40%, rgb(49, 146, 83) 60%, rgb(90, 164, 37) 60%, rgb(90, 164, 37) 80%, rgb(121, 172, 0) 80%, rgb(121, 172, 0) 100%); width:150px; height:150px; margin:10px auto;}
	</style>
</head><?php
    // Verify answer

    $solved = false;
    $key = '';

    if (isset($_POST['answer']) && isset($_POST['team'])) {
        $answer = strtolower(trim($_POST['answer']));
        $team = intval($_POST['team']);
        switch ($current_puzzle) {
            case 1: $solved = ($answer == 'test'); break;
            case 2: $solved = ($answer == '144'); break;
            case 3: $solved = ($answer == 'aloha'); break;
            case 4: $solved = ($answer == 'lummi'); break;
            case 5: $solved = ($answer == 'bar'); break;
            default: $solved = false; break;
        }

        if ($solved) {
            $keys = array(); // [puzzle][team]
            $keys[1] = ['',1,2,4,1,2,5];
            $keys[2] = ['',1,2,4,1,2,5];
            $keys[3] = ['',1,2,4,1,2,5];
            $keys[4] = ['',1,2,4,1,2,5];
            $keys[5] = ['',1,2,4,1,2,5];

            $key = $keys[$current_puzzle][$team];
        }
    }

    file_put_contents('attempts.csv',date("Y-m-d H:i:s")."\t".$_SERVER['REMOTE_ADDR']."\t$current_puzzle\t$team\t$answer\t".(($solved)?'true':'false')."\n",FILE_APPEND);

    if ($solved) {
        echo "<body class='solved'>";
            echo "<div id='bhf-logo'></div>";
            echo "<h1>Brighthouse Puzzles</h1>";
            echo "<p>Key.$current_puzzle: ".$key."</p>";
            echo "<p><a href='./".($current_puzzle+1)."'>Next Page &gt;</a></p>";
        echo "</body>";
    } else {
        echo "<body class='unsolved'>";
            echo "<div id='bhf-logo'></div>";
            echo "<h1>Brighthouse Puzzles</h1>";
            echo "<div><form id='form-submitanswer' method='post'>";
                echo "<label for='team'>Team #:</label><select name='team' id='team-dropdown'><option value='1'>Team 1</option><option value='2'>Team 2</option><option value='3'>Team 3</option><option value='4'>Team 4</option><option value='5'>Team 5</option><option value='6'>Team 6</option></select>";
                echo "<label for='answer'><p>Solve puzzle $current_puzzle:</p></label>";
                echo "<input type='text' name='answer' id='answer-box' />";
                echo "<input type='submit' title='Submit' value='Submit' />";
            echo "</form></div>";
            echo "<script> document.getElementById('team-dropdown').focus(); </script>";
        echo "</body>";
    }
?></body></html>