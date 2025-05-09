<?php

class Sessions
{
    public static function setLoggedState($username)
    {
        $_SESSION['user'] = ['username' => $username];
    }

    public static function isLogged()
    {
        return isset($_SESSION['user']);
    }

    public static function getUsername()
    {
        return $_SESSION['user']['username'] ?? null;
    }
}
