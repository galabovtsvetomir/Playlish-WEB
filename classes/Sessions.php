<?php

class Sessions
{
    public static function setLoggedState($username, $id)
    {
        $_SESSION['user'] = ['username' => $username, 'id' => $id];
    }

    public static function isLogged()
    {
        return isset($_SESSION['user']);
    }

    public static function getUsername()
    {
        return $_SESSION['user']['username'] ?? null;
    }

    public static function getUserId()
    {
        return $_SESSION['user']['id'] ?? null;
    }
}
