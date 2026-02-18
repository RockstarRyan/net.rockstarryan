<?php

error_reporting(E_ALL);

include_once("admin/includes/connect_to_db.inc");

// ********* START Check if event_url is valid and get event_name **********

$event_slug = substr($_SERVER["REQUEST_URI"],strlen($GLOBALS['filepath']));

$query_select = "SELECT `event_id`, `event_name`, `event_password` FROM `".$GLOBALS['app_name']."_events` WHERE `event_slug` = ?";
$stmt_select = $db->prepare($query_select);
$stmt_select->bind_param('s', $event_slug);
$stmt_select->execute();
$stmt_select->store_result();
$stmt_select->bind_result($event_id,$event_name,$event_password);

if ($stmt_select->num_rows > 0) {
	while ($stmt_select->fetch()) {
		$GLOBALS['event_id'] = $event_id;
		$GLOBALS['event_name'] = $event_name;
		$GLOBALS['event_password'] = $event_password;
	}
} else {
	$GLOBALS['status'] = 'error';
	$GLOBALS['event_name'] = 'unknown';
}

$stmt_select->free_result();

// ********* END Check if event_url is valid and get event_name **********

?>

<!DOCTYPE html><html><head>
	<title>Sign In – <?php echo $GLOBALS['event_name']; ?></title>
	<link type='text/css' rel='stylesheet' href='<?php echo $GLOBALS['filepath']; ?>style.css'>
</head><body class='center'>
	<h1>Attendance</h1>
	<h2><strong>Event:</strong> <?php echo $GLOBALS['event_name']; ?></h2>

	<?php // ********* START Check if form data has been submitted **********

	$GLOBALS['status'] = '';

	if ((isset($_POST['fn'])) && (isset($_POST['ln'])) && (isset($_POST['ua']))) {
		if (($GLOBALS['event_password']==null) || ($GLOBALS['event_password'] == $_POST['pw'])) {
			$query_select = "SELECT `user_id` FROM `".$GLOBALS['app_name']."_users` WHERE `user_firstname` = ? AND `user_lastname` = ?";
			$stmt_select = $db->prepare($query_select);
			$stmt_select->bind_param('ss', $_POST['fn'], $_POST['ln']);
			$stmt_select->execute();
			$stmt_select->store_result();
			$stmt_select->bind_result($user_id);

			if ($stmt_select->num_rows > 0) {
				while ($stmt_select->fetch()) {
					$GLOBALS['user_id'] = $user_id;
				}
			} else {
				$user_name = 'event'.$GLOBALS['event_id'].'-'.$_POST['fn'].'-'.$_POST['ln'];
				$query_insert = "INSERT INTO `".$GLOBALS['app_name']."_users`(`user_name`, `user_firstname`, `user_lastname`) VALUES (?, ?, ?)";
				$stmt_insert = $db->prepare($query_insert);
				$stmt_insert->bind_param('sss', $user_name, $_POST['fn'], $_POST['ln']);
				$stmt_insert->execute();

				if ($stmt_insert->affected_rows > 0) {
					$GLOBALS['user_id'] = $stmt_insert->insert_id;;
				} else {
					$GLOBALS['user_id'] = null;
				}
			}
			$stmt_select->free_result();

			$query_insert = "INSERT INTO `".$GLOBALS['app_name']."_responses` (`event_id`, `user_id`, `user_ip`, `user_browser`) VALUES (?,?,?,?)";
			$stmt_insert = $db->prepare($query_insert);
			$stmt_insert->bind_param('iiss', $GLOBALS['event_id'], $GLOBALS['user_id'], $_SERVER['REMOTE_ADDR'], $_POST['ua']);
			$stmt_insert->execute();

			if ($stmt_insert->affected_rows > 0) {
				// Success ?>
				<p class='success'>Attendance recorded for "<?php echo $_POST['fn']." ".$_POST['ln']; ?>"</p>
				<button onclick='showForm()' id='resubmit'>Submit another response</button>
				<?php $GLOBALS['status'] = 'success';
			} else {
				// Failure ?>
				<p class='error'>Error: attendance has NOT been recorded for "<?php echo $_POST['fn']." ".$_POST['ln']; ?>" &ndash; please try again</p>
				<?php $GLOBALS['status'] = 'warning';
			}
		} else {
			$GLOBALS['status'] = 'incorrect-password'; ?>
			<p class='warning' id='incorrect-password'>Error: event password is incorrect. Please double-check that you entered the password correctly</p>
			<?php
		}
	} else {
		$GLOBALS['status'] = ($GLOBALS['status']=='error') ? 'error' : 'waiting';
	}

	// ********* END Check if form data has been submitted ********** ?>

	<p class='warning' id='error-not-found'>Error: event not found. Please double-check that you entered the URL correctly</p>
	<div id='form'>
		<p>Please enter your first and last name.</p>
		<?php if ($GLOBALS['event_password'] !== null) {echo "<p class='small'>This event requires a password to submit attendance.</p>";} ?>
		<form method='post'>
			<label for='fn'>First Name:</label><input type='text' name='fn' id='fn-input' size='20' required />
			<label for='ln'>Last Name:</label><input type='text' name='ln' id='ln-input' size='20' required />
			<?php if ($GLOBALS['event_password'] !== null) {echo "<label for='pw'>Password:</label><input type='text' name='pw' id='pw-input' size='20' />";} ?>
			<input type='hidden' name='ua' id='ua-input' value=''>
			<button type='submit' name='submit'>Submit</button>
		</form>
	</div>
	<script>
		document.getElementById('fn-input').focus();
		<?php if ($GLOBALS['status'] == 'success') { ?>
			document.getElementById('form').style.display = 'none';
			document.getElementById('resubmit').focus();
		<?php } ?>
		<?php if ($GLOBALS['status'] == 'error') { ?>
			document.getElementById('form').style.display = 'none';
			document.getElementById('error-not-found').style.display = 'block';
		<?php } ?>
		function showForm() {
			document.getElementById('form').style.display = 'block';
			document.getElementById('resubmit').style.display = 'none';
			document.getElementById('fn-input').focus();
		}
		document.getElementById('ua-input').value = navigator.userAgent;
	</script>
</body></html>

<?php $db->close(); ?>
