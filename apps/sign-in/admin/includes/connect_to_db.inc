<?php

$GLOBALS['app_name'] = 'sign_in';
$GLOBALS['filepath'] = '/apps/sign-in/';

// Connect to MySQL DB
$db = new mysqli('localhost','apps.'.$GLOBALS['app_name'],'oFjqmh2QNdRYLASz','app_db',8889);

if (mysqli_connect_errno()) {
	echo "<p>Error: Could not connect to database. Please try again later.</p>"; exit;
}
