<?php include_once("includes/admin-header.inc"); ?>

<h2>View User Report</h2>
<form method='get'>
	<label for='user_id'>Event</label>
	<select name='user_id'>
		<option value=''>--- Select a user ---</option><?php
		// Event List (select options)
		$query_select = "SELECT `user_id`, `user_name`, `user_firstname`, `user_lastname` FROM `".$GLOBALS['app_name']."_users` WHERE `user_role` <= ?";
		$stmt_select = $db->prepare($query_select);
		$stmt_select->bind_param('i', $_SESSION['user_role']);
		$stmt_select->execute();
		$stmt_select->store_result();
		$stmt_select->bind_result($user_id, $user_name, $user_firstname, $user_lastname);
		while ($stmt_select->fetch()) {
			$s = '';
			if (isset($_GET['user_id']) && ($user_id == $_GET['user_id'])) {
				$s = ' selected';
				$GLOBALS['report_user_name'] = $user_name;
				$GLOBALS['report_user_firstname'] = $user_firstname;
				$GLOBALS['report_user_lastname'] = $user_lastname;
			}
			echo "<option value='$user_id' $s>$user_name &ndash; $user_firstname $user_lastname</option>";
		}
		$stmt_select->free_result();
	?></select>
	<button type='submit'>Generate Report</button>
</form>
<?php if (isset($_GET['user_id'])) {
	// Event Report (table)
	$query_select = "SELECT r.`response_id`, e.`event_slug`, r.`user_ip`, r.`user_browser`, r.`time_created`, e.`event_start` FROM `".$GLOBALS['app_name']."_responses` AS r LEFT JOIN `".$GLOBALS['app_name']."_events` AS e ON e.`event_id` = r.`event_id` WHERE r.`user_id` = ?";
	$stmt_select = $db->prepare($query_select);
	$stmt_select->bind_param('i', $_GET['user_id']);
	$stmt_select->execute();
	$stmt_select->store_result();
	$stmt_select->bind_result($response_id, $event_slug, $user_ip, $user_browser, $time_created, $event_start); ?>
	<p><strong>User</strong>: <?php echo $GLOBALS['report_user_firstname']." ".$GLOBALS['report_user_lastname']." (".$GLOBALS['report_user_name'].")"; ?></p>
	<p><strong>Attendees</strong>: <?php echo $stmt_select->num_rows; ?></p>
	<table><thead><tr>
		<th>Response ID</th><th>Event Slug</th><th>User IP</th><th>User Browser</th><th>Sign-In Time</th><th>Relative to Event Start</th>
	</tr></thead><tbody><tr>
		<?php while ($stmt_select->fetch()) {
			$formatted_time_diff = 'N/A';
			if (isset($event_start)) {
				$time_diff = date_diff(date_create($event_start), date_create($time_created));
				if ($time_diff->y > 0) 		{$formatted_time_diff = $time_diff->format('%r%y years, %m months');}
				else if ($time_diff->m > 0) {$formatted_time_diff = $time_diff->format('%r%m months, %d days');}
				else if ($time_diff->d > 0) {$formatted_time_diff = $time_diff->format('%r%d days, %h hours');}
				else if ($time_diff->h > 0) {$formatted_time_diff = $time_diff->format('%r%h hours, %i minutes');}
				else if ($time_diff->i > 0) {$formatted_time_diff = $time_diff->format('%r%i minutes, %s seconds');}
				else 						{$formatted_time_diff = $time_diff->format('%r%s seconds');}
			}
			echo "<tr><td>$response_id</td><td>$event_slug</td><td>$user_ip</td><td>$user_browser</td><td>$time_created</td><td>".$formatted_time_diff."</td></tr>";
		} ?>
	</tr></tbody></table>
	<?php $stmt_select->free_result();
} else {
	echo "<p class='small'>Report data will appear here...</p>";
} ?>

<?php include_once("includes/admin-footer.inc"); ?>
