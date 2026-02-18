<?php //include_once("includes/admin-header.inc");

$output = shell_exec('git reset --hard origin/main');
$output .= shell_exec('git pull');
echo "<pre>$output</pre>";

?>