<!DOCTYPE html>
<html><head>
    <?php 

    $current_puzzle = 13;

    ?>
    <title>Puzzle #<?php echo $current_puzzle; ?> &ndash; Road Trip Puzzles</title>
    <meta charset="UTF-8">
	<meta name="description" content="Puzzle #<?php echo $current_puzzle; ?> of the Road Trip Puzzles book">
	<meta name="keywords" content="">
	<meta name="author" content="Ryan Gross">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
		body {font-family:"Apple Chancery", "Cormorant Garamond", cursive, serif; background-color:#C3A77E; color:#000; display:flex; flex-flow:column nowrap; justify-content:center; margin:0; padding:0; text-align:center;}
        body.solved {background-color:#000; color:#fff;}
        a {color:#fff;}
        p {font-size: 24px;}
	</style>
</head><?php
    // Verify answer

    $solved = false;

    if (isset($_POST['answer'])) {
        $answer = strtolower(trim($_POST['answer']));
        switch ($current_puzzle) {
            case 13: $solved = ($answer == 'ordinance'); break;
            case 14: $solved = ($answer == 'trinidad'); break;
            case 15: $solved = ($answer == '62907013'); break;
            default: $solved = false; break;
        }
    }

    $keys = array();
    $keys[13] = 'Broncos';
    $keys[14] = 'First';
    $keys[15] = 'Congratulations';

    if ($solved) {
        echo "<body class='solved'>";
        echo "<h1>Road Trip Puzzles</h1>";
        echo "<p>Key.$current_puzzle: ".$keys[$current_puzzle]."</p>";
        echo "<p><a href='../".($current_puzzle+1)."'>Next Page &gt;</a></p>";
        echo "</body>";
    } else {
        echo "<body class='unsolved'>";
        echo "<h1>Road Trip Puzzles</h1>";
        echo "<div><form id='form-submitanswer' method='post'>";
            echo "<label for='answer'><p>Solve page $current_puzzle:</p></label>";
            echo "<input type='text' name='answer' id='answer-box' />";
            echo "<input type='submit' title='Submit' value='Submit' />";
        echo "</form></div>";
        echo "<script> document.getElementById('answer-box').focus(); </script>";
        echo "</body>";
    }
?></body></html>