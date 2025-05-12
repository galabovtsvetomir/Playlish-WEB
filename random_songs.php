<?php
header("Content-Type: application/json");

// Свържи се с базата
$conn = new mysqli("localhost", "root", "", "playlish");
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Вземи 5 случайни песни
$sql = "SELECT id, song_name, artist_name, image_path, music_path FROM songs ORDER BY RAND() LIMIT 5";
$result = $conn->query($sql);

$songs = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $songs[] = $row;
    }
}

echo json_encode($songs);
$conn->close();
?>
