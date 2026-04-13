<!DOCTYPE html>
<html><head>
    <?php 

    $path = $_SERVER['REQUEST_URI'];
    $requested_puzzle = intval(explode('/',$path)[2]);
    if (is_int($requested_puzzle)) {
        if (!($requested_puzzle>0 && $requested_puzzle<=45)) {
            echo "Error: invalid URL (invalid puzzle number). Try again.";
            exit(0);
        }
    } else {
        echo "Error: invalid URL (not integer). Try again.";
        exit(0);
    }

    $current_puzzle = $requested_puzzle;

    ?>
    <title>Puzzle #<?php echo $current_puzzle; ?> &ndash; Road Trip Puzzles</title>
    <meta charset="UTF-8">
	<meta name="description" content="Puzzle #<?php echo $current_puzzle; ?> of the Road Trip Puzzles book">
	<meta name="keywords" content="">
	<meta name="author" content="Ryan Gross">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
		body {font-family:"Apple Chancery", "Cormorant Garamond", serif; background-color:#C3A77E; color:#000; display:flex; flex-flow:column nowrap; justify-content:center; margin:0; padding:0; text-align:center;}
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
            case 1: $solved = ($answer == 'volcano'); break;
            case 2: $solved = ($answer == 'transpacific'); break;
            case 3: $solved = ($answer == 'aloha'); break;
            case 4: $solved = ($answer == 'lummi'); break;
            case 5: $solved = ($answer == 'bar'); break;
            case 6: $solved = ($answer == 'seattle'); break;
            case 7: $solved = ($answer == 'dream'); break;
            case 8: $solved = ($answer == 'marin'); break;
            case 9: $solved = ($answer == 'hotel'); break;
            case 10: $solved = ($answer == ''); break;
            case 11: $solved = ($answer == 'frogs'); break;
            case 12: $solved = ($answer == ''); break;
            case 13: $solved = ($answer == 'ordinance'); break;
            case 14: $solved = ($answer == 'trinidad'); break;
            case 15: $solved = ($answer == '62907013'); break;
            case 16: $solved = ($answer == 'houston'); break;
            case 17: $solved = ($answer=='remember the alamo' || $answer=='rememberthealamo'); break;
            case 18: $solved = ($answer == 'alamo'); break;
            case 19: $solved = ($answer == 'gabe'); break;
            case 20: $solved = ($answer == 'thirst'); break;
            case 21: $solved = ($answer == 'florida'); break;
            case 22: $solved = ($answer == 'south'); break;
            case 23: $solved = ($answer == 'lead'); break;
            case 24: $solved = ($answer=='jefferson davis' || $answer=='jeffersondavis'); break;
            case 25: $solved = ($answer == 'trip'); break;
            case 26: $solved = ($answer == 'betty'); break;
            case 27: $solved = ($answer == 'yard'); break;
            case 28: $solved = ($answer == 'guest'); break;
            case 29: $solved = ($answer=='new york' || $answer=='newyork'); break;
            case 30: $solved = ($answer=='times square' || $answer=='timessquare'); break;
            case 31: $solved = ($answer == 'subway'); break;
            case 32: $solved = ($answer == 'car'); break;
            case 33: $solved = ($answer == 'pier'); break;
            case 34: $solved = ($answer == 'flight'); break;
            case 35: $solved = ($answer == '1679413'); break;
            case 36: $solved = ($answer == 'depart'); break;
            case 37: $solved = ($answer == 'honorable'); break;
            case 38: $solved = ($answer == 'hays'); break;
            case 39: $solved = ($answer == '59'); break;
            case 40: $solved = ($answer=='peach state' || $answer=='peachstate'); break;
            case 41: $solved = ($answer == 'pine'); break;
            case 42: $solved = ($answer == 'atlanta'); break;
            case 43: $solved = ($answer == 'uptown'); break;
            case 44: $solved = ($answer == '13'); break;
            case 45: $solved = ($answer == ''); break;
            default: $solved = false; break;
        }
    }

    $keys = array(); //
    $keys[1] = 'Eyes';
    $keys[2] = 'Height';
    $keys[3] = 'Bottle';
    $keys[4] = 'Pot';
    $keys[5] = 'Cross';
    $keys[6] = 'Song';
    $keys[7] = 'Hit';
    $keys[8] = 'Stand';
    $keys[9] = 'Double';
    $keys[10] = 'Broncos';
    $keys[11] = 'Denver';
    $keys[12] = 'The';
    $keys[13] = 'History';
    $keys[14] = 'Read';
    $keys[15] = 'Must';
    $keys[16] = 'Cannot';
    $keys[17] = 'South';
    $keys[18] = 'South';
    $keys[19] = 'Lead';
    $keys[20] = 'Two';
    $keys[21] = 'True';
    $keys[22] = 'Crossroads';
    $keys[23] = 'Taxis';
    $keys[24] = 'Married';
    $keys[25] = '$120';
    $keys[26] = 'Road';
    $keys[27] = 'Kitty';
    $keys[28] = 'Hawk';
    $keys[29] = 'Fir';
    $keys[30] = 'Hermitage';
    $keys[31] = 'Pea';
    $keys[32] = 'Taste';
    $keys[33] = 'Count';
    $keys[34] = '';
    $keys[35] = '';
    $keys[36] = '';
    $keys[37] = '';
    $keys[38] = '';
    $keys[39] = '';
    $keys[40] = '';
    $keys[41] = 'Lands';
    $keys[42] = 'Idea';
    $keys[43] = 'Gate';
    $keys[44] = 'Affine';
    $keys[45] = 'Congratulations!';

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