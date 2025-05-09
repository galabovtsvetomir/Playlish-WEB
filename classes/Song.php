<?php

class Song implements JsonSerializable
{
    private $id;
    private $songName;
    private $artistName;
    private $genreId;
    private $imagePath;
    private $musicPath;
    private $createdAt;

    public function __construct(string $id, string $songName, string $artistName, string $genreId, string $imagePath, string $musicPath, string $createdAt)
    {
        $this->id = $id;
        $this->songName = $songName;
        $this->artistName = $artistName;
        $this->genreId = $genreId;
        $this->imagePath = $imagePath;
        $this->musicPath = $musicPath;
        $this->createdAt= $createdAt;
    }

    // Getters and setters
    public function getSongName(): string
    {
        return $this->songName;
    }

    public function setSongName(string $songName): void
    {
        $this->songName = $songName;
    }

    public function getArtistName(): string
    {
        return $this->artistName;
    }

    public function setArtistName(string $artistName): void
    {
        $this->artistName = $artistName;
    }

    public function getGenreId(): string
    {
        return $this->genreId;
    }

    public function setGenreId(string $genreId): void
    {
        $this->genreId = $genreId;
    }

    public function getImagePath(): string
    {
        return $this->imagePath;
    }

    public function setImagePath(string $imagePath): void
    {
        $this->imagePath = $imagePath;
    }

    public function getMusicPath(): string
    {
        return $this->musicPath;
    }

    public function setMusicPath(string $musicPath): void
    {
        $this->musicPath = $musicPath;
    }

    public function getUploadedOn(): string
    {
        return $this->createdAt;
    }

    public function setUploadedOn(string $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

    public static function fromArray(array $data): Song
    {
        return new Song(
            $data['id'],
            $data['song_name'],
            $data['artist_name'],
            $data['genre_id'],
            $data['image_path'],
            $data['music_path'],
            $data['created_at']
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
            'song_name' => $this->songName,
            'artist_name' => $this->artistName,
            'genre_id' => $this->genreId,
            'image_path' => $this->imagePath,
            'music_path' => $this->musicPath,
            'created_at' => $this->createdAt,
        ];
    }
}
?>
