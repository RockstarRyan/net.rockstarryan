<?php

error_reporting(E_ALL);

function connectToDB($query, $arg_array, $func_success, $func_failure) {
	$type = substr($query,0,strpos($query,' '));
	switch ($type) {case 'INSERT': case 'SELECT': break; default: echo "Invalid input"; exit;}

	// Connect to MySQL DB
	@$db = new mysqli('localhost','app_sign-in','oFjqmh2QNdRYLASz','app_db',8809);

	if (mysqli_connect_errno()) {
		echo "<p>Error: Could not connect to database. Please try again later.</p>";
		exit;
	}

	$type = substr($query,0,strpos($query,' '));

	$stmt = $db->prepare($query);
	$stmt->bind_param('sss', ...$arg_array);
	$stmt->execute();

	if ($type == "INSERT") {
		if ($stmt->affected_rows > 0) {
			$func_success();
		} else {
			$func_failure();
		}
	} else if ($type == "SELECT") {
		$stmt->store_result();
		$stmt->bind_result(...$array);
	    $func_success($stmt);

	}

	$db->close();
}

?>
