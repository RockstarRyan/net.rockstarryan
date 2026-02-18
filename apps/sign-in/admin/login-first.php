<?php

session_start();

error_reporting(E_ALL);

include_once("includes/connect_to_db.inc");

if ((isset($_SESSION['user_name'])) && (isset($_SESSION['user_password']))) {
	header('Location: '.dirname($_SERVER["SCRIPT_NAME"]).'/');
	exit;
}

$GLOBALS['login_error'] = false;

if ((isset($_POST['new_user_name'])) && (isset($_POST['new_user_password'])) && (isset($_POST['new_user_firstname'])) && (isset($_POST['new_user_lastname']))) {
	$password_hash = md5($_POST['new_user_password']);
	$user_role = 15;

	$query_insert = "INSERT INTO `".$GLOBALS['app_name']."_users` (`user_name`, `user_password`, `user_email`, `user_phone`, `user_firstname`, `user_lastname`, `user_role`) VALUES (?,?,?,?,?,?,?)";
	$stmt_insert = $db->prepare($query_insert);
	$stmt_insert->bind_param('ssssssi', $_POST['new_user_name'], $password_hash, $_POST['new_user_email'], $_POST['new_user_phone'], $_POST['new_user_firstname'], $_POST['new_user_lastname'], $user_role);
	$stmt_insert->execute();

	if ($stmt_insert->affected_rows > 0) {
		$_SESSION['user_name'] = $_POST['new_user_name'];
		$_SESSION['user_password'] = $password_hash;
		$_SESSION['user_id'] = $stmt_insert->insert_id;
		$_SESSION['user_role'] = $user_role;

		header('Location: '.dirname($_SERVER["SCRIPT_NAME"]).'/');
		exit;
	} else {
		$GLOBALS['login_error'] = true;
	}

}

?><!DOCTYPE html><html><head>
	<title>Create First User</title>
	<link type='text/css' rel='stylesheet' href='admin.css'>
</head><body id='login-container'>
	<div class='center'>
		<h1>Create First User</h1>
		<?php if ($GLOBALS['login_error'] == true) {
			echo "<p class='warning'>Error</p>";
		} ?>
		<form method='post' action=''>
			<label for='new_user_name'>Username:</label> <input required type='text' name='new_user_name' id='un-input' size='15' />
			<label for='new_user_password'>Password:</label> <input required type='text' name='new_user_password' id='pw-input' size='15' />
			<label for='new_user_firstname'>First Name:</label> <input required type='text' name='new_user_firstname' id='fn-input' size='15' />
			<label for='new_user_lastname'>Last Name:</label> <input required type='text' name='new_user_lastname' id='ln-input' size='15' />
			<label for='new_user_phone'>Phone Number:</label> <input type='text' name='new_user_phone' id='ph-input' size='15' />
			<label for='new_user_email'>Email Address:</label> <input type='email' name='new_user_email' id='em-input' size='15' />
			<button type='submit' name='submit'>Log In</button>
		</form>
	</div>
	<p>Intellectual property of Ryan Gross, 2021</p>
	<p><a href='mailto:webmaster@rockstarryan.net'>Contact Webmaster</a></p>
</body></html>

<?php $db->close(); ?>
