<?php

require_once 'bootstrap.php';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
    try {
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        $action = $data['action'] ?? null;
        $songId = $data['song_id'] ?? null;

        if ($action === 'increment_view' && $songId !== null) {
            file_put_contents('debug_log.txt', "✅ POST action: $action, ID: $songId\n", FILE_APPEND);
           
            try {
                $pdo = (new Db())->getConnection();
                file_put_contents('debug_log.txt', "✅ PDO CONNECTED\n", FILE_APPEND);
            } catch (Exception $e) {
                file_put_contents('debug_log.txt', "❌ PDO ERROR: " . $e->getMessage() . "\n", FILE_APPEND);
                http_response_code(500);
                exit;
            }
            file_put_contents('debug_log.txt', "👉 songId type: " . gettype($songId) . "\n", FILE_APPEND);
            $stmt = $pdo->prepare("UPDATE songs SET views = views + 1 WHERE id = ?");
            file_put_contents('debug_log.txt', "👉 songId type: " . gettype($songId) . "\n", FILE_APPEND);
            $stmt->execute([$songId]);
            file_put_contents('debug_log.txt', "✅ SQL UPDATE executed for ID: $songId\n", FILE_APPEND);
            $result = ['success' => true];
        } elseif ($action === 'like' && $songId !== null) {
            $pdo = (new Db())->getConnection();
            $stmt = $pdo->prepare("UPDATE songs SET likes = likes + 1 WHERE id = ?");
            $stmt->execute([$songId]);
            $result = ['success' => true];
        } elseif ($action === 'dislike' && $songId !== null) {
            $pdo = (new Db())->getConnection();
            $stmt = $pdo->prepare("UPDATE songs SET dislikes = dislikes + 1 WHERE id = ?");
            $stmt->execute([$songId]);
            $result = ['success' => true];
        } else {
            // Ако не е action заявка, значи качваме песен
            $result = (new SongRequestHandler())->addSong($_POST, $_FILES);
        }

    } catch (Exception $e) {
        $result = ['error' => $e->getMessage()];
    }
    break;


    case 'GET':
        try {
            // Check if keyword, genre, and sort parameters are provided in the query parameters
            $keyword = $_GET['keyword'] ?? null;
            $genre = $_GET['genre'] ?? null;
            $sort = $_GET['sort'] ?? 'newest'; // Default to 'newest' if sort is not provided

            // Create an instance of SongRequestHandler and call getAllSongs with the parameters
            $result = (new SongRequestHandler())->getAllSongs($keyword, $genre, $sort);
        } catch (Exception $e) {
            $result = ['error' => $e->getMessage()];
        }
        break;

    case 'DELETE':
        try {
            // Assuming there's a way to identify the song to delete (e.g., song ID passed in the request)
            $songId = $_REQUEST['id'] ?? null;
            $result = (new SongRequestHandler())->deleteSong($songId);
        } catch (Exception $e) {
            $result = ['error' => $e->getMessage()];
        }
        break;
        
    default:
        // unknown request method
        http_response_code(405); // Method Not Allowed
        $result = ['error' => 'Method Not Allowed'];
        break;
}

echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>
