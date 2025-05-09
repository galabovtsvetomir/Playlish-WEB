<?php

class Playlist implements JsonSerializable
{
    private $id;
    private $name;
    private $userId;
    private $createdAt;
    private $length;

    public function __construct(string $id, string $name, string $userId, string $createdAt, string $length = "00:00:00")
    {
        $this->id = $id;
        $this->name = $name;
        $this->userId = $userId;
        $this->createdAt = $createdAt;
        $this->length = $length;
    }

    // Getters and setters
    public function getId(): string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getUserId(): string
    {
        return $this->userId;
    }

    public function setUserId(string $userId): void
    {
        $this->userId = $userId;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }

    public function setCreatedAt(string $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

    public function getLength(): string
    {
        return $this->length;
    }

    public function setLength(string $length): void
    {
        $this->length = $length;
    }

    public static function fromArray(array $data): Playlist
    {
        return new Playlist(
            $data['id'],
            $data['name'],
            $data['user_id'],
            $data['created_at'],
            $data['length'] ?? "00:00:00"
        );
    }

    public function __toString(): string
    {
        return json_encode($this, JSON_UNESCAPED_UNICODE);
    }

    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'user_id' => $this->userId,
            'created_at' => $this->createdAt,
            'length' => $this->length,
        ];
    }
}
?>
