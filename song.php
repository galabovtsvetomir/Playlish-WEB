<?php

require_once 'bootstrap.php';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        try {
            $result = (new SongRequestHandler())->addSong($_POST, $_FILES);
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
