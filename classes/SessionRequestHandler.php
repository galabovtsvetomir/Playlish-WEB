<?php

class SessionRequestHandler
{
    private $connection;

    public function __construct()
    {
        $this->connection = (new Db())->getConnection();
    }

    public function login(array $data): ?User
    {
        $stmt = $this->connection->prepare('SELECT * FROM users WHERE username = :username');
        $stmt->execute(['username' => $data['username']]);
        $user = $stmt->fetch();

        if ($user && password_verify($data['password'], $user['password']))
        {
            Sessions::setLoggedState($user['username']);
            return User::fromArray($user);
        }

        return null;
    }

    public function checkLoginStatus(): ?array
    {
        return Sessions::isLogged() ? ['name' => Sessions::getUsername()] : null;
    }

    public function logout(): bool
    {
        session_start();
        session_unset();
        session_destroy();
        return true;
    }
}