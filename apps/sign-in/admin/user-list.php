<?php include_once("includes/admin-header.inc"); ?>

<h2>View User List</h2>
<?php // Event Report (table)
$query_select = "SELECT `user_id`, `user_name`, `user_firstname`, `user_lastname`, `user_email`, `user_phone`, `user_role`, `time_created`, `time_updated` FROM `".$GLOBALS['app_name']."_users`";
$stmt_select = $db->prepare($query_select);
$stmt_select->execute();
$stmt_select->store_result();
$stmt_select->bind_result($user_id, $user_name, $user_firstname, $user_lastname, $user_email, $user_phone, $user_role, $time_created, $time_updated);?>
<table><thead><tr>
	<th>User ID</th><th>User Name</th><th>First Name</th><th>Last Name</th><th>Email Address</th><th>Phone Number</th><th>User Role</th><th>Date Created</th><th>Last Updated</th>
</tr></thead><tbody><tr>
	<?php while ($stmt_select->fetch()) {
		echo "<tr><td><a href='modify-user.php?user_id=$user_id'>$user_id</a></td><td>$user_name</td><td>$user_firstname</td><td>$user_lastname</td><td>$user_email</td><td>$user_phone</td><td>$user_role</td><td>$time_created</td><td>$time_updated</td></tr>";
	} ?>
</tr></tbody></table>
<?php $stmt_select->free_result();

include_once("includes/admin-footer.inc"); ?>
