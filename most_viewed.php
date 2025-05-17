<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "playlish");
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed"]));
}

// Вземаме и снимката
$sql = "SELECT song_name, views, image_path FROM songs ORDER BY views DESC LIMIT 10";
$result = $conn->query($sql);

$data = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);
$conn->close();
?>
