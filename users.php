<?php

require_once 'bootstrap.php';

switch ($_SERVER['REQUEST_METHOD'])
{
    case 'POST':
        try {
            // create user (register)
            $result = (new UserRequestHandler())->createUser($_POST);
        } catch (DuplicateUserException $e) {
            $result = ['error' => $e->getMessage()];
        }
        break;
    case 'GET':
        // get user info
        if (isset($_GET['id']))
        {
            $result = (new UserRequestHandler())->getUserById($_GET['id']);
        }
        else
        {
            $result = (new UserRequestHandler())->getAllUsers();
        }
        break;
    case 'PUT':
        // update user info
        $result = UserRequestHandler::updateUser();
        break;
    case 'DELETE':
        // delete user
        $result = UserRequestHandler::deleteUser();
        break;
    default:
        // unknown request method
        break;
}

echo json_encode($result, JSON_UNESCAPED_UNICODE);