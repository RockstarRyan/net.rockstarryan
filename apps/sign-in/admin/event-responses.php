<?php include_once("includes/admin-header.inc"); ?>

<h2>View Event Report</h2>
<form method='get'>
	<label for='event_id'>Event</label>
	<select name='event_id'>
		<option value=''>--- Select an event ---</option><?php
		// Event List (select options)
		$query_select = "SELECT `event_id`, `event_slug`, `event_name`, `event_start` FROM `".$GLOBALS['app_name']."_events` WHERE `event_admin` = ? ORDER BY `event_slug`";
		$stmt_select = $db->prepare($query_select);
		$stmt_select->bind_param('i', $_SESSION['user_id']);
		$stmt_select->execute();
		$stmt_select->store_result();
		$stmt_select->bind_result($event_id, $event_slug, $event_name, $event_start);
		while ($stmt_select->fetch()) {
			$s = '';
			if (isset($_GET['event_id']) && ($event_id == $_GET['event_id'])) {
				$s = ' selected';
				$GLOBALS['report_event_name'] = $event_name;
				$GLOBALS['report_event_start'] = $event_start;
			}
			echo "<option value='$event_id' $s>$event_slug &ndash; $event_name</option>";
		}
		$stmt_select->free_result();
	?></select>
	<?php if ($_SESSION['user_role'] >= 15) {$is_checked = (isset($_GET['advanced']) && $_GET['advanced']==true) ? ' checked' : ''; echo "<div class='wide small'><input name='advanced' type='checkbox'$is_checked> <label for='advanced'>Advanced Search</label></div>";} ?>
	<button type='submit'>Generate Report</button>
</form>
<?php if (isset($_GET['event_id'])) {
	// Event Report (table)
	$is_advanced = (isset($_GET['advanced']) && $_SESSION['user_role'] >= 15);
	$advanced_columns = ($is_advanced) ? ' r.`user_ip`, r.`user_browser`,' : '';
	$query_select = "SELECT u.`user_id`, u.`user_firstname`, u.`user_lastname`,".$advanced_columns." r.`time_created` FROM `".$GLOBALS['app_name']."_responses` AS r LEFT JOIN `".$GLOBALS['app_name']."_users` AS u ON u.`user_id` = r.`user_id` WHERE r.`event_id` = ?";
	$stmt_select = $db->prepare($query_select);
	$stmt_select->bind_param('i', $_GET['event_id']);
	$stmt_select->execute();
	$stmt_select->store_result();
	$user_id = $user_firstname = $user_lastname = $time_created = $user_ip = $user_browser = '';
	if ($is_advanced) {
		$stmt_select->bind_result($user_id, $user_firstname, $user_lastname, $user_ip, $user_browser, $time_created);
	} else {
		$stmt_select->bind_result($user_id, $user_firstname, $user_lastname, $time_created);
	}

	$relative_date = date_create(); $relative_th = 'Now';
	if (isset($GLOBALS['report_event_start'])) {$relative_date = date_create($GLOBALS['report_event_start']); $relative_th = "Event Start";} ?>
	<p><strong>Event Name</strong>: <?php echo $GLOBALS['report_event_name']; ?></p>
	<p><strong>Attendees</strong>: <?php echo $stmt_select->num_rows; ?></p>
	<table><thead><tr>
		<th>User ID</th><th>First Name</th><th>Last Name</th><?php if ($is_advanced) {echo '<th>User IP</th><th>User Browser</th>';} ?><th>Sign-In Time</th><th>Relative to <?php echo $relative_th; ?></th>
	</tr></thead><tbody><tr>
		<?php while ($stmt_select->fetch()) {
			$time_diff = date_diff($relative_date, date_create($time_created));
			$formatted_time_diff = 'ERROR';
			if ($time_diff->y > 0) 		{$formatted_time_diff = $time_diff->format('%r%y years, %m months');}
			else if ($time_diff->m > 0) {$formatted_time_diff = $time_diff->format('%r%m months, %d days');}
			else if ($time_diff->d > 0) {$formatted_time_diff = $time_diff->format('%r%d days, %h hours');}
			else if ($time_diff->h > 0) {$formatted_time_diff = $time_diff->format('%r%h hours, %i minutes');}
			else if ($time_diff->i > 0) {$formatted_time_diff = $time_diff->format('%r%i minutes, %s seconds');}
			else 						{$formatted_time_diff = $time_diff->format('%r%s seconds');}
			$advanced_result = ($is_advanced) ? "<td>$user_ip</td><td>$user_browser</td>" : "";
			echo "<tr><td>$user_id</td><td>$user_firstname</td><td>$user_lastname</td>$advanced_result<td>$time_created</td><td>".$formatted_time_diff."</td></tr>";
		} ?>
	</tr></tbody></table>
	<?php $stmt_select->free_result();
} else {
	echo "<p class='small'>Report data will appear here...</p>";
} ?>

<?php include_once("includes/admin-footer.inc"); ?>
