<?php
require_once 'bootstrap.php';
header('Content-Type: application/json');

$currentUserId = $_SESSION['user']['id'] ?? null;

if (!$currentUserId) {
    echo json_encode([]);
    exit;
}

$conn = (new DB())->getConnection();

$sql = "
    SELECT 
        c.id AS conversation_id,
        CASE 
            WHEN c.user1_id = :uid THEN c.user2_id
            ELSE c.user1_id
        END AS user_id,
        u.username,
        u.profile_picture
    FROM conversations c
    JOIN users u ON 
        (c.user1_id = :uid AND u.id = c.user2_id)
        OR 
        (c.user2_id = :uid AND u.id = c.user1_id)
";

$stmt = $conn->prepare($sql);
$stmt->execute([':uid' => $currentUserId]);

$conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($conversations);
