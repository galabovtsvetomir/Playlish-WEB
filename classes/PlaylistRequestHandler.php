<?php

class PlaylistRequestHandler {

    private $connection;

    public function __construct()
    {
        $this->connection = (new Db())->getConnection();
    }

    public function createPlaylist(array $playlistData): ?Playlist
    {
        $name = $playlistData['name'];
        $userId = $playlistData['user_id'];
        

        $insertStatement = $this->connection->prepare("INSERT INTO `playlists` (user_id, name ) VALUES (:user_id, :name )");
        $insertResult = $insertStatement->execute([
            'user_id' => $userId,
            'name' => $name,
        ]);

        if (!$insertResult) 
        {
            if ($insertStatement->errorInfo()[1] == 1062) 
            {
                throw new Exception("Playlist with name $name already exists for user $userId");
            }

            return null;
        }

        $id = $this->connection->lastInsertId();

        $selectStatement = $this->connection->prepare("SELECT * FROM playlists WHERE id = ?");
        $selectResult = $selectStatement->execute([$id]);

        if (!$selectResult) 
        {
            // something very wrong has happened
            return null;
        }

        $playlistData = $selectStatement->fetch();

        return Playlist::fromArray($playlistData);
    }

    public function getPlaylistById($id): ?Playlist
    {
        $selectStatement = $this->connection->prepare("SELECT * FROM playlists WHERE id = ?");
        $selectResult = $selectStatement->execute([$id]);

        if (!$selectResult) 
        {
            // something very wrong has happened
            return null;
        }

        $playlistData = $selectStatement->fetch();

        return Playlist::fromArray($playlistData);
    }

    public function getAllPlaylistsByUserId($userId): array
    {
        $selectStatement = $this->connection->prepare("SELECT * FROM playlists WHERE user_id = ?");
        $selectResult = $selectStatement->execute([$userId]);

        if (!$selectResult) 
        {
            // something very wrong has happened
            return [];
        }

        $playlists = $selectStatement->fetchAll();

        return array_map(function($playlistData) {
            return Playlist::fromArray($playlistData);
        }, $playlists);
    }

    public function deletePlaylist($id): bool
    {
        $deleteStatement = $this->connection->prepare("DELETE FROM playlists WHERE id = ?");
        $deleteResult = $deleteStatement->execute([$id]);

        return $deleteResult;
    }

    public function addSongToPlaylist($playlistId, $songId): bool
    {
        $insertStatement = $this->connection->prepare("INSERT INTO playlist_songs (playlist_id, song_id) VALUES (:playlist_id, :song_id)");
        return $insertStatement->execute([
            'playlist_id' => $playlistId,
            'song_id' => $songId
        ]);
    }

    public function removeSongFromPlaylist($playlistId, $songId): bool
    {
        $deleteStatement = $this->connection->prepare("DELETE FROM playlist_songs WHERE playlist_id = :playlist_id AND song_id = :song_id");
        return $deleteStatement->execute([
            'playlist_id' => $playlistId,
            'song_id' => $songId
        ]);
    }

    public function getPlaylistDetails($playlistId): ?array
    {
        $selectStatement = $this->connection->prepare("
            SELECT playlists.*, songs.* 
            FROM playlists
            LEFT JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id
            LEFT JOIN songs ON playlist_songs.song_id = songs.id
            WHERE playlists.id = ?");
        $selectResult = $selectStatement->execute([$playlistId]);

        if (!$selectResult) 
        {
            // something very wrong has happened
            return null;
        }

        $playlistData = $selectStatement->fetchAll();

        if (empty($playlistData)) {
            return null;
        }

        $playlist = Playlist::fromArray($playlistData[0]);
        $songs = array_map(function($songData) {
            return Song::fromArray($songData);
        }, $playlistData);

        return [
            'playlist' => $playlist,
            'songs' => $songs
        ];
    }
}
?>
