<?php include_once("includes/admin-header.inc"); ?>

<h2>Add an Event</h2><?php
if ((isset($_POST['add_event_slug'])) && (isset($_POST['add_event_name']))) {
	if ($_POST['add_event_start']=='') {$_POST['add_event_start'] = null;}
	if ($_POST['add_event_end']=='') {$_POST['add_event_end'] = null;}

	$event_password = ($_POST['add_event_password'] == '') ? null : $_POST['add_event_password'];

	$query_insert = "INSERT INTO `".$GLOBALS['app_name']."_events` (`event_slug`, `event_name`, `event_password`, `event_start`, `event_end`, `event_admin`) VALUES (?,?,?,?,?,?)";
	$stmt_insert = $db->prepare($query_insert);
	$stmt_insert->bind_param('sssssi', $_POST['add_event_slug'], $_POST['add_event_name'], $event_password, $_POST['add_event_start'], $_POST['add_event_end'], $_SESSION['user_id']);
	$stmt_insert->execute();

	if ($stmt_insert->affected_rows > 0) {
		// Success
		?><p class='success'>Event "<?php echo $_POST['add_event_name']; ?>" has been created</p><?php
	} else {
		// Failure
		?><p class='error'>Error when creating event "<?php echo $_POST['add_event_name'] ?>": <?php echo "(".$stmt_insert->errno.") ".$stmt_insert->error." '".$_POST['add_event_start']."'"; ?></p><?php
	}
}

//$current_date = date('m/d/Y, h:i A');
// 09/14/2021, 12:30 PM

?>
<form method='post'>
	<label for='add_event_name'>Event Name:</label><input type='text' name='add_event_name' id='add_event_name-input' size='20' required />
	<label for='add_event_slug'>Event Slug:</label><input type='text' name='add_event_slug' id='add_event_slug-input' size='20' required />
	<label for='add_event_password'>Event Password:</label><input type='text' name='add_event_password' id='add_event_password-input' size='20' />
	<label for='add_event_start'>Event Start:</label><input type='datetime-local' name='add_event_start' id='add_event_start-input' size='20' value='<?php echo $current_date; ?>'/>
	<label for='add_event_end'>Event End:</label><input type='datetime-local' name='add_event_end' id='add_event_end-input' size='20' />
	<button type='submit' name='submit'>Submit</button>
</form>

<?php include_once("includes/admin-footer.inc"); ?>
