<?php

require_once 'bootstrap.php';

if (!Sessions::isLogged()) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$username = $_SESSION['user']['username'];
$handler = new UserRequestHandler();

try {
    $user = $handler->getUserIdByUsername($username);
    if ($user) {
        echo json_encode(['user_id' => $user->getId()]);
    } else {
        echo json_encode(['error' => 'User not found']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
