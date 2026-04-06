<!DOCTYPE html>
<html><head>
    <?php 

    $current_puzzle = 15

    ?>
    <title>Puzzle #<?php echo $current_puzzle; ?> &ndash; Road Trip Puzzles</title>
    <meta charset="UTF-8">
	<meta name="description" content="Puzzle #<?php echo $current_puzzle; ?> of the Road Trip Puzzles book">
	<meta name="keywords" content="">
	<meta name="author" content="Ryan Gross">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
		body {font-family:"Apple Chancery", "Cormorant Garamond", cursive, serif; background-color:#C3A77E; color:#000; display:flex; flex-flow:column nowrap; justify-content:space-between; margin:0; padding:0;}
        body.solved {background-color:#000; color:#fff;}
	</style>
</head><body><?php
    // Verify answer

    $solved = false;

    if (isset($_POST['answer'])) {
        $answer = strtolower(trim($_POST['answer']));
        switch ($current_puzzle) {
            case 13: $solved = ($_POST['answer'] == 'ordinance'); break;
            case 14: $solved = ($_POST['answer'] == 'trinidad'); break;
            case 15: $solved = ($_POST['answer'] == '62907013'); break;
            default: $solved = false; break;
        }
    }

    $keys = array(13='Broncos', 14='First', 15='Congratulations');

    if ($solved) {?>
        <h1>Road Trip Puzzles</h1>
        <p><?php echo "Key.$current_puzzle: ".$keys[$current_puzzle]; ?></p>
        <p><a href='../<?php echo $current_puzzle; ?>'>Next Page &gt;</a></p>

    <?php} else {?>
        <h1>Road Trip Puzzles</h1>
        <p>Solve page <?php echo $current_puzzle; ?>:</p>
        <div><form id='form-submitanswer' method='post'>
            <label for='answer'><p>Solve page <?php echo $current_puzzle; ?>:</p></label>
            <input type='text' name='answer' id='answer-box' />
            <input type='submit' title='Submit' value='Submit' />
        </form></div>
        <script>
            document.getElementById('answer-box').focus();
        </script>
    <?php}
?></body></html>