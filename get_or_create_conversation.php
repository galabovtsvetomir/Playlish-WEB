<?php
require_once 'bootstrap.php'; // включи DB, класове, autoload

header('Content-Type: application/json');


$currentUserId = $_SESSION['user']['id'] ?? null;

if (!$currentUserId || !isset($_POST['other_user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Missing data']);
    exit;
}

$otherUserId = (int)$_POST['other_user_id'];

$handler = new ConversationRequestHandler();
$conversationId = $handler->getOrCreateConversation($currentUserId, $otherUserId);

echo json_encode(['success' => true, 'conversation_id' => $conversationId]);
