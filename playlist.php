<?php

require_once 'bootstrap.php';

$handler = new PlaylistRequestHandler();
$result = ['error' => 'Invalid request']; // Default result

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        if (isset($_POST['user_id']) && isset($_POST['playlist_name'])) {
            // Create a new playlist
            try {
                $result = $handler->createPlaylist([
                    'user_id' => $_POST['user_id'],
                    'name' => $_POST['playlist_name']
                ]);
            } catch (Exception $e) {
                $result = ['error' => $e->getMessage()];
            }
        }
        break;

    case 'GET':
        if (isset($_GET['playlist_id'])) {
            // Get playlist details
            try {
                $result = $handler->getPlaylistDetails($_GET['playlist_id']);
            } catch (Exception $e) {
                $result = ['error' => $e->getMessage()];
            }
        } elseif (isset($_GET['user_id'])) {
            // Get all playlists for the user
            try {
                $result = $handler->getAllPlaylistsByUserId($_GET['user_id']);
            } catch (Exception $e) {
                $result = ['error' => $e->getMessage()];
            }
        }
        break;

    default:
        http_response_code(405); // Method Not Allowed
        $result = ['error' => 'Method Not Allowed'];
        break;
}

echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>
