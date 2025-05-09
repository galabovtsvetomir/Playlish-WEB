<?php

class UserRequestHandler {

    private $connection;

    public function __construct()
    {
        $this->connection = (new Db())->getConnection();
    }

    public function createUser($userData): ?User
    {
        $name = $userData['name'];
        $password = password_hash($userData['password'], PASSWORD_DEFAULT);
        $email=$userData['email'];

        $insertStatement = $this->connection->prepare("INSERT INTO `users` (username, password, email) VALUES (:username, :password, :email)");
        $insertResult = $insertStatement->execute([
            'username' => $name,
            'password' => $password,
            'email' => $email
        ]);

        if (!$insertResult) 
        {
            if ($insertStatement->errorInfo()[1] == 1062) 
            {
                throw new DuplicateUserException("User with name $name or email $email already exists");
            }

            return null;
        }

        $id = $this->connection->lastInsertId();

        $selectStatement = $this->connection->prepare("SELECT * FROM users WHERE id = ?");
        $selectResult = $selectStatement->execute([$id]);

        if (!$selectResult) 
        {
            // something very wrong has happened
            return null;
        }
        $userData = $selectStatement->fetch();

        return User::fromArray($userData);
    }

    public function getUserById($id): ?User
    {
        if (!Session::isLogged())
        { // simple authorization
            return [];
        }

        $selectStatement = $this->connection->prepare("SELECT * FROM users WHERE id = ?");
        $selectResult = $selectStatement->execute([$id]);

        if (!$selectResult) 
        {
            // something very wrong has happened
            return null;
        }

        $userData = $selectStatement->fetch();

        return User::fromArray($userData);
    }

    public function getUserIdByUsername(string $username): ?User
    {
        $selectStatement = $this->connection->prepare("SELECT * FROM users WHERE username = ?");
        $selectResult = $selectStatement->execute([$username]);

        if (!$selectResult) {
            // something very wrong has happened
            return null;
        }

        $userData = $selectStatement->fetch();

        return $userData ? User::fromArray($userData) : null;
    }

    public function getAllUsers(): array
    {

        if (!Session::isLogged())
        { // simple authorization
            return [];
        }

        $selectStatement = $this->connection->prepare("SELECT * FROM `users`");
        $selectResult = $selectStatement->execute();

        if (!$selectResult) 
        {
            // something very wrong has happened
            return [];
        }

        $users = $selectStatement->fetchAll();

        return array_map(function($userData) {
            return User::fromArray($userData);
        }, $users);
    }

    public static function updateUser()
    {
        // update user info
    }

    public static function deleteUser()
    {
        // delete user
    }

}