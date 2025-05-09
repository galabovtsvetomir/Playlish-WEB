<?php

class User implements JsonSerializable
{
    private $id;
    private $name;
    private $password;
    private $registeredOn;

    public function __construct(string $id, string $name, string $password, string $registeredOn)
    {
        $this->id = $id;
        $this->name = $name;
        $this->password = $password;
        $this->registeredOn = $registeredOn;
    }

    // getters and setters
    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): void
    {
        $this->password = $password;
    }

   
    public static function fromArray(array $data): User
    {
        return new User($data['id'], $data['username'], $data['password'], $data['RegisteredOn']); /*The fields must be the same as  in the DB */
    }

    public function __toString(): string
    {
        return json_encode($this, JSON_UNESCAPED_UNICODE);
    }
    
    public function getId(): string {
        return $this->id;
    }

    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'registered_on' => $this->registeredOn,
        ];
    }
}