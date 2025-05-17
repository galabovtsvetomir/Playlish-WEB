<?php
require_once 'bootstrap.php';

// Примерен код за search_users.php (разширен)
$currentUserId = $_SESSION['user']['id'] ?? null;

$conn = (new DB())->getConnection();

$stmt = $conn->prepare("
  SELECT u.id, u.username, u.profile_picture,
         c.id AS conversation_id
  FROM users u
  LEFT JOIN conversations c
    ON (c.user1_id = :me AND c.user2_id = u.id)
    OR (c.user2_id = :me AND c.user1_id = u.id)
  WHERE u.username LIKE :query AND u.id != :me
");
$stmt->execute([
  ':me' => $currentUserId,
  ':query' => '%' . $_GET['q'] . '%'
]);
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($users);
