<?php

require_once 'bootstrap.php';

switch ($_SERVER['REQUEST_METHOD'])
{
    case 'POST':
        $result = (new SessionRequestHandler())->login($_POST);
        break;
    case 'GET':
        $result = (new SessionRequestHandler())->checkLoginStatus();
        break;
    case 'DELETE':
        $result = (new SessionRequestHandler())->logout();
        break;
    default:
        // unknown request method
        break;
}

echo json_encode($result, JSON_UNESCAPED_UNICODE);