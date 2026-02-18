<?php

session_start();

error_reporting(E_ALL);

if ((!isset($_SESSION['user_name'])) || (!isset($_SESSION['user_password']))) {
	header('Location: '.dirname($_SERVER["PHP_SELF"]).'/login.php');
	exit;
}

include_once("includes/connect_to_db.inc");

?><!DOCTYPE html><html><head>
	<title>Attendance Dashboard</title>
	<link type='text/css' rel='stylesheet' href='<?php echo $GLOBALS['filepath']."admin/"; ?>admin.css'>
</head><body><div id='container'>
	<header>
		<h1>Attendance Dashboard</h1>
		<div id='logout-button'>
			<span>Welcome, <?php echo $_SESSION['user_firstname']; ?></span>
			<form method='post' class='small' action='logout.php'>
				<button type='submit'>Log Out</button>
			</form>
		</div>
	</header>
	<nav><ul><?php
		$array = [
			["Dashboard",		"index.php"],
			["Responses"],
			["Responses by Event",	"event-responses.php"],
			["Responses by User",	"user-responses.php"],
			["Events"],
			["View Event List",	"list-events.php"],
			["Add Event",		"add-event.php"],
			["Delete Event",	"delete-event.php"],
			["Users"],
			["View User List",	"user-list.php"],
			["Add User",		"add-user.php"],
			["Delete User",		"delete-user.php"],
		];
		for ($i = 0; $i < sizeof($array); $i++) {
			if (isset($array[$i][1])) {
				$class = (substr($_SERVER["SCRIPT_NAME"],strrpos($_SERVER["SCRIPT_NAME"],"/")+1) == $array[$i][1]) ? " class='active'" : '';
				echo "<li".$class."><a href='".$array[$i][1]."'>".$array[$i][0]."</a></li>";
			} else {
				echo "<h3>".$array[$i][0]."</h3>";
			}
		}
	?></ul></nav>
	<main><?php
