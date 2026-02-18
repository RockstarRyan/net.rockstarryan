<?php

session_start();

error_reporting(E_ALL);

include_once("includes/connect_to_db.inc");

function redirect($url='') {header('Location: '.dirname($_SERVER["SCRIPT_NAME"]).'/'.$url); exit;}

if ((isset($_SESSION['user_name'])) && (isset($_SESSION['user_password']))) {
	redirect('');
}

$GLOBALS['login_error'] = false;

$query_select = "SELECT `user_role`, `user_id`, `user_name`, `user_password`, `user_firstname`, `user_lastname` FROM `".$GLOBALS['app_name']."_users`";
$stmt_select = $db->prepare($query_select);
$stmt_select->execute();
$stmt_select->store_result();

if ($stmt_select->num_rows === 0) {
	redirect('login-first.php');
}

if ((isset($_POST['user_name'])) && (isset($_POST['user_password']))) {
	$password_hash = md5($_POST['user_password']);
	$stmt_select->bind_result($user_role,$user_id,$user_name,$password,$user_firstname,$user_lastname);
	$log = "";
	while ($stmt_select->fetch() === true) {
		//$log .= $user_name.$_POST['user_name'] . $password.$password_hash . " ";
		if ($user_name==$_POST['user_name'] && $password==$password_hash) {
			$_SESSION['user_name'] = $_POST['user_name'];
			$_SESSION['user_password'] = $password_hash;
			$_SESSION['user_id'] = $user_id;
			$_SESSION['user_role'] = $user_role;
			$_SESSION['user_firstname'] = $user_firstname;
			$_SESSION['user_lastname'] = $user_lastname;
			redirect('');
		}
	}
	$GLOBALS['login_error'] = true;
}

$stmt_select->free_result();

?><!DOCTYPE html><html><head>
	<title>Log In</title>
	<link type='text/css' rel='stylesheet' href='admin.css'>
</head><body id='login-container'>
	<div class='center'>
		<h1>Admin Log In</h1>
		<?php if ($GLOBALS['login_error'] === true) {
			echo "<p class='warning'>Username and password combination not valid </p>"; // (".$log.")
		} ?>
		<form method='post' action=''>
			<label for='user_name'>Username:</label> <input type='text' name='user_name' required id='un-input' size='15' />
			<label for='user_password'>Password:</label> <input type='password' name='user_password' id='pw-input' size='15' />
			<button type='submit' name='submit'>Log In</button>
		</form>
	</div>
	<p>Intellectual property of Ryan Gross, 2021</p>
	<p><a href='mailto:webmaster@rockstarryan.net'>Contact Webmaster</a></p>
</body></html>

<?php $db->close(); ?>
