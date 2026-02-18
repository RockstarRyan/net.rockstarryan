<!DOCTYPE html><html><head>
	<title>Test Page</title>
</head><body>
	<?php

	if ((!isset($_POST['username'])) || (!isset($_POST['password']))) {
		// visitor needs to enter a username and password ?>
		<h1>Please Log In</h1>
		<p>The contents of this page are protected</p>
		<form method='post' action=''>
			<p><label for='username'>Username:</label> <input type='text' name='username' id='username' size='15' /></p>
			<p><label for='password'>Password:</label> <input type='password' name='password' id='password' size='15' /></p>
			<button type='submit' name='submit'>Log In</button>
		</form>
		<?php
	} else {
		if (($_POST['username']=='user') && ($_POST['password']=='pass')) {
			// visitor's credentials match ?>
			<h1>Welcome</h1>
			<p>You are now logged in.</p>
			<?php
		} else {
			// visitor's credentials do not match ?>
			<h1>Unauthorized</h1>
			<p>You are not authorized to access this resource</p>
			<?php
		}
	}
	?>
</body></html>
