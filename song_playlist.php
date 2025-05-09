<?php

require_once 'bootstrap.php';

$handler = new SongPlaylistRequestHandler();
$result = ['error' => 'Invalid request']; // Default result



switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        //Why $_POST['playlist_ids']:
        //In PHP, when it receives form data where multiple inputs share the same name ending with [], it automatically creates an array from these inputs.

        if (isset($_POST['song_id']) && isset($_POST['playlist_ids']) && is_array($_POST['playlist_ids'])) {
            // Add song to playlists
            try {
                $result = $handler->addSongToPlaylists($_POST['song_id'], $_POST['playlist_ids']);
            } catch (Exception $e) {
                $result = ['error' => $e->getMessage()];
            }
        } else {
            $result = ['error' => 'Invalid playlist IDs'];
        }
        break;

    case 'GET':
        if (isset($_GET['playlist_id'])) {
            // Get songs in the playlist
            try {
                $result = $handler->getSongsInPlaylist($_GET['playlist_id']);
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
