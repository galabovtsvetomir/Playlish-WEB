<?php
$log = json_decode(file_get_contents("php://input"), true);
file_put_contents("debug_log.txt", date("Y-m-d H:i:s") . " | " . print_r($log, true) . "\n", FILE_APPEND);
?>
