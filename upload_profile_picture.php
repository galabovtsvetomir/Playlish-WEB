<?php
require_once 'bootstrap.php';

$username = $_SESSION['user']['username'] ?? null;
if (!$username || !isset($_FILES['profile_image'])) {
    echo json_encode(['error' => 'Missing user or file']);
    exit;
}

$targetDir = "uploads/profile_pictures/";
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}

$filename = time() . "_" . basename($_FILES["profile_image"]["name"]);
$targetFile = $targetDir . $filename;

if (move_uploaded_file($_FILES["profile_image"]["tmp_name"], $targetFile)) {
    $conn = (new DB)->getConnection();
    $stmt = $conn->prepare("UPDATE users SET profile_picture = :pic WHERE username = :username");
    $stmt->bindParam(':pic', $targetFile);
    $stmt->bindParam(':username', $username);
    $stmt->execute();

    echo json_encode(['success' => true, 'image_url' => $targetFile]);
} else {
    echo json_encode(['error' => 'Failed to move file']);
}
