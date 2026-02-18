<?php include_once("includes/admin-header.inc"); ?>

<h1>Welcome!</h1>

<h2>User Information</h2>
<ul>
	<li>User name: <?php echo $_SESSION['user_name']; ?></li>
	<li>User password (MD5): <?php echo $_SESSION['user_password']; ?></li>
	<li>User ID: <?php echo $_SESSION['user_id']; ?></li>
	<li>User role: <?php echo $_SESSION['user_role']; ?></li>

<?php include_once("includes/admin-footer.inc"); ?>
