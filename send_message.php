<?php
require_once 'bootstrap.php';

$senderId = $_SESSION['user']['id'] ?? null;
$receiverId = $_POST['receiver_id'] ?? null;
$message = trim($_POST['message'] ?? "");

if (!$senderId || !$receiverId || !$message) {
    echo json_encode(['error' => 'Missing data']);
    exit;
}

$conn = (new DB())->getConnection();

// 1. Намери или създай conversation
$stmt = $conn->prepare("
    SELECT id FROM conversations 
    WHERE (user1_id = :u1 AND user2_id = :u2) 
       OR (user1_id = :u2 AND user2_id = :u1)
");
$stmt->execute([':u1' => $senderId, ':u2' => $receiverId]);
$conversationId = $stmt->fetchColumn();

if (!$conversationId) {
    // Няма такава, създаваме
    $stmt = $conn->prepare("INSERT INTO conversations (user1_id, user2_id) VALUES (:u1, :u2)");
    $stmt->execute([':u1' => min($senderId, $receiverId), ':u2' => max($senderId, $receiverId)]);
    $conversationId = $conn->lastInsertId();
}

// 2. Записваме съобщението
$stmt = $conn->prepare("
    INSERT INTO messages (conversation_id, sender_id, receiver_id, message) 
    VALUES (:c, :s, :r, :m)
");
$stmt->execute([
    ':c' => $conversationId,
    ':s' => $senderId,
    ':r' => $receiverId,
    ':m' => $message
]);

echo json_encode(['success' => true]);
