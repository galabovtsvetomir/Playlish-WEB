<?php

require_once 'bootstrap.php';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if (isset($_GET['id'])) {
            $genreId = intval($_GET['id']);
            $result = (new GenreHandler())->getGenreNameById($genreId);
        } else {
            $result = (new GenreHandler())->getGenres();
        }
        break;
    default:
        // unknown request method
        http_response_code(405); // Method Not Allowed
        $result = ['error' => 'Method Not Allowed'];
        break;
}

echo json_encode($result, JSON_UNESCAPED_UNICODE);
