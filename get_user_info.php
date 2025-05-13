<?php
require_once 'bootstrap.php';

$username = $_SESSION['user']['username'] ?? null;

if (!$username) {
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$conn = (new DB)->getConnection();

$stmt = $conn->prepare("SELECT username, profile_picture FROM users WHERE username = :username");
$stmt->bindParam(':username', $username);
$stmt->execute();

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo json_encode($user);
} else {
    echo json_encode(['error' => 'User not found']);
}
