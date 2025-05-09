<?php

class SongRequestHandler {

    private $connection;

    public function __construct()
    {
        $this->connection = (new Db())->getConnection();
    }

    public function addSong(array $data, array $files): ?Song
    {
        // Define relative base path
        $basePath = "uploads/";
    
        $imageTargetDir = $basePath . "images/";
        $musicTargetDir = $basePath . "music/";
    
        // Ensure directories exist
        if (!is_dir($imageTargetDir)) {
            mkdir($imageTargetDir, 0777, true);
        }
        if (!is_dir($musicTargetDir)) {
            mkdir($musicTargetDir, 0777, true);
        }
    
        // Get the file paths
        $imageFilePath = $imageTargetDir . basename($files["song_picture"]["name"]);
        $musicFilePath = $musicTargetDir . basename($files["song_file"]["name"]);
    
        // Move uploaded files to target directories
        if (move_uploaded_file($files["song_picture"]["tmp_name"], $imageFilePath) &&
            move_uploaded_file($files["song_file"]["tmp_name"], $musicFilePath)) {
    
            // Get the song data from the POST request
            $songName = $data['song_name'];
            $artistName = $data['artist_name'];
            $genreId = $data['genre_id'];
    
            // Insert the song metadata into the database with relative paths
            $stmt = $this->connection->prepare("INSERT INTO songs (song_name, artist_name, genre_id, image_path, music_path) VALUES (:song_name, :artist_name, :genre_id, :image_path, :music_path)");
            $stmt->bindParam(':song_name', $songName);
            $stmt->bindParam(':artist_name', $artistName);
            $stmt->bindParam(':genre_id', $genreId);
            $stmt->bindParam(':image_path', $imageFilePath);
            $stmt->bindParam(':music_path', $musicFilePath);
    
            if ($stmt->execute()) {
                // Fetch the inserted song data from the database
                $selectStatement = $this->connection->prepare("SELECT * FROM songs WHERE id = :id");
                $selectStatement->execute([':id' => $this->connection->lastInsertId()]);
                $songData = $selectStatement->fetch();
    
                // Convert the fetched data into a Song object and return it
                return Song::fromArray($songData);
            } else {
                throw new Exception('Database insertion failed');
            }
        } else {
            throw new Exception('File upload failed');
        }
    }
    

    public function getSongById($id): ?Song
    {
        $selectStatement = $this->connection->prepare("SELECT * FROM songs WHERE id = ?");
        $selectResult = $selectStatement->execute([$id]);

        if (!$selectResult) 
        {
            return null;
        }

        $songData = $selectStatement->fetch();

        return Song::fromArray($songData);
    }

    public function getAllSongs($keyword = null, $genre = null, $sort = 'newest'): array
{
    // Construct the base SQL query
    $sql = "SELECT * FROM `songs`";
    $params = [];
    
    // Add WHERE clauses if a keyword or genre is provided
    $conditions = [];
    if (!empty($keyword)) {
        $conditions[] = "(song_name LIKE ? OR artist_name LIKE ?)";
        $keyword = "%$keyword%"; // Add wildcards to search for partial matches
        $params[] = $keyword;
        $params[] = $keyword;
    }
    if (!empty($genre)) {
        $conditions[] = "genre_id = ?";
        $params[] = $genre;
    }
    
    // Append conditions to SQL query if any
    if (!empty($conditions)) {
        $sql .= " WHERE " . implode(" AND ", $conditions);
    }
    
    // Add ORDER BY clause for sorting
    if ($sort === 'newest') {
        $sql .= " ORDER BY created_at DESC";
    } elseif ($sort === 'oldest') {
        $sql .= " ORDER BY created_at ASC";
    }
    
    // Prepare the SQL statement
    $selectStatement = $this->connection->prepare($sql);
    
    // Bind parameters dynamically
    foreach ($params as $index => $param) {
        $selectStatement->bindValue($index + 1, $param);
    }
    
    // Execute the SQL statement
    $selectResult = $selectStatement->execute();
    
    // Check if the query was successful
    if (!$selectResult) {
        return [];
    }
    
    // Fetch the songs
    $songs = $selectStatement->fetchAll();
    
    // Map the fetched data to Song objects
    return array_map(function($songData) {
        return Song::fromArray($songData);
    }, $songs);
}

}
?>
