<?php

require_once 'bootstrap.php';

class SongPlaylistRequestHandler
{
    private $connection;

    public function __construct()
    {
        $this->connection = (new Db())->getConnection();
    }

    public function addSongToPlaylists($songId, $playlistIds) {
        $this->connection->beginTransaction();
        
        try {
            foreach ($playlistIds as $playlistId) {
                $insertStatement = $this->connection->prepare("INSERT INTO playlist_song (playlist_id, song_id) VALUES (?, ?)");
                $insertStatement->execute([$playlistId, $songId]);
            }

            $this->connection->commit();
            return ['success' => true];
        } catch (Exception $e) {
            $this->connection->rollBack();
            throw $e;
        }
    }

    public function removeSongFromPlaylist($playlistId, $songId)
    {
        $deleteStatement = $this->connection->prepare("DELETE FROM playlist_song WHERE playlist_id = ? AND song_id = ?");
        $deleteResult = $deleteStatement->execute([$playlistId, $songId]);

        if (!$deleteResult) {
            throw new Exception("Failed to remove song from playlist");
        }
    }

    public function getPlaylistsBySongId($songId): array
    {
        $selectStatement = $this->connection->prepare("SELECT p.* FROM playlists p INNER JOIN playlist_song ps ON p.id = ps.playlist_id WHERE ps.song_id = ?");
        $selectResult = $selectStatement->execute([$songId]);

        if (!$selectResult) {
            throw new Exception("Failed to retrieve playlists for the song");
        }

        $playlists = $selectStatement->fetchAll();

        return array_map(function($playlistData) {
            return Playlist::fromArray($playlistData);
        }, $playlists);
    }

    public function getSongsInPlaylist($playlistId): array
{
    $selectStatement = $this->connection->prepare("
        SELECT s.* 
        FROM songs s 
        INNER JOIN playlist_song ps ON s.id = ps.song_id 
        WHERE ps.playlist_id = ?
    ");
    $selectResult = $selectStatement->execute([$playlistId]);

    if (!$selectResult) {
        // something very wrong has happened
        return [];
    }

    $songs = $selectStatement->fetchAll();
    return array_map(function($songData) {
        return Song::fromArray($songData);
    }, $songs);
}
}
