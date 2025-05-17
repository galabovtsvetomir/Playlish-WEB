<?php
require_once 'bootstrap.php';

header('Content-Type: application/json');

$currentUserId = $_SESSION['user']['id'] ?? null;
$conversationId = $_GET['conversation_id'] ?? null;

if (!$currentUserId || !$conversationId) {
    echo json_encode(['error' => 'Missing data']);
    exit;
}

$conn = (new DB())->getConnection();

$stmt = $conn->prepare("
    SELECT sender_id, message, timestamp 
    FROM messages 
    WHERE conversation_id = :cid 
    ORDER BY timestamp ASC
");
$stmt->execute([':cid' => $conversationId]);

$messages = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $messages[] = [
        'message' => $row['message'],
        'timestamp' => $row['timestamp'],
        'is_mine' => $row['sender_id'] == $currentUserId
    ];
}

echo json_encode($messages);
