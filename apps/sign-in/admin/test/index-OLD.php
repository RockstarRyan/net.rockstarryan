<?php

session_start();

error_reporting(E_ALL);

// Connect to MySQL DB
$db = new mysqli('localhost','app_sign-in','oFjqmh2QNdRYLASz','app_db',8889);

if (mysqli_connect_errno()) {
	echo "<p>Error: Could not connect to database. Please try again later.</p>"; exit;
}

if ((isset($_POST['user_name'])) && (isset($_POST['user_password']))) {
	$password_hash = md5($_POST['user_password']);

	$query_select = "SELECT `user_role`, `user_id` FROM `sign_in_users` WHERE `user_name` = ? AND `user_password` = ?";
	$stmt_select = $db->prepare($query_select);
	$stmt_select->bind_param('ss', $_POST['user_name'], $password_hash);
	$stmt_select->execute();
	$stmt_select->store_result();
	$stmt_select->bind_result($user_role, $user_id);

	if ($stmt_select->num_rows > 0) {
		while ($stmt_select->fetch()) {
			$_SESSION['user_name'] = $_POST['user_name'];
			$_SESSION['user_password'] = $_POST['user_password'];
			$_SESSION['user_id'] = $user_id;
			$_SESSION['user_role'] = $user_role;
			break;
		}
	} else {
		$GLOBALS['login'] = 'invalid';
	}

	$stmt_select->free_result();
} else {
	$GLOBALS['login'] = 'waiting';
}

?>

<!DOCTYPE html><html><head>
	<title>Attendance Dashboard</title>
	<link type='text/css' rel='stylesheet' href='admin.css'>
</head><body><?php

	if ((isset($_SESSION['user_name'])) && (isset($_SESSION['user_password']))) {
		// visitor's credentials match ?>
		<header>
			<h1>Attendance Dashboard</h1>
			<div id='logout-button'>
				<span>Welcome, <?php echo $_SESSION['user_name']; ?></span>
				<form method='post' class='small'>
					<input type='hidden' name='log_out' value='true'>
					<button type='submit'>Log Out</button>
				</form>
			</div>
		</header>
		<nav><ul><?php
			$array = [
				["Dashboard",		"index.php"],
				["Attendance"],
				["Event Reports",	"event-reports.php"],
				["Events"],
				["View Event List",	"list-events.php"],
				["Add Event",		"add-event.php"],
				["Delete Event",	"delete-event.php"],
				["Users"],
				["View User List",	"list-users.php"],
				["Add User",		"add-user.php"],
				["Delete User",		"delete-user.php"],
			];
			for ($i = 0; $i < sizeof($array); $i++) {
				if (isset($array[$i][1])) {
					$class = (substr(__FILE__,strrpos(__FILE__,"/")+1) == $array[$i][1]) ? " class='active'" : '';
					echo "<li".$class."><a href='".$array[$i][1]."'>".$array[$i][0]."</a></li>";
				} else {
					echo "<h3>".$array[$i][0]."</h3>";
				}
			}
		?></ul></nav>
		<main>
			<?php if ($_SESSION['user_role'] >= 1) {include("includes/view_report.inc");} ?>
			<?php if ($_SESSION['user_role'] >= 1) {include("includes/add_event.inc");} ?>
			<div id='section-modifyevent'>
				<h2>Modify an Event</h2>
				<form method='post'>
					<label for='fn'>First Name:</label><input type='text' name='fn' id='fn-input' size='20' required />
					<label for='ln'>Last Name:</label><input type='text' name='ln' id='ln-input' size='20' required />
					<button type='submit' name='submit'>Submit</button>
				</form>
			</div><div id='section-adduser'>
				<h2>Add a User</h2>
				<form method='post'>
					<label for='fn'>First Name:</label><input type='text' name='fn' id='fn-input' size='20' required />
					<label for='ln'>Last Name:</label><input type='text' name='ln' id='ln-input' size='20' required />
					<button type='submit' name='submit'>Submit</button>
				</form>
			</div>
		</main>
		<?php
	} else {
		// visitor needs to enter a username and password ?>
		<div class='center'>
			<h1>Admin Log In</h1>
			<?php if ($GLOBALS['login'] == 'invalid') {
				echo "<p class='warning'>Username and password combination not valid</p>";
			} ?>
			<form method='post' action=''>
				<label for='user_name'>Username:</label> <input type='text' name='user_name' id='un-input' size='15' />
				<label for='user_password'>Password:</label> <input type='password' name='user_password' id='pw-input' size='15' />
				<button type='submit' name='submit'>Log In</button>
			</form>
		</div> <?php
	}
	?>
</body></html>

<?php $db->close(); ?>
