<?php

class GenreHandler
{
    private $connection;

    public function __construct()
    {
       $this->connection = (new Db())->getConnection();
    }

    public function getGenres(): array
    {
        // Query to fetch genres from the database
        $stmt = $this->connection->query("SELECT id, name FROM genre");

        // Check if genres were fetched successfully
        if ($stmt) {
            // Fetch all genres and return them as an associative array
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            // Return an empty array or handle the error as needed
            return [];
        }
    }

    /**
 * Get the name of the genre by its ID.
 *
 * @param int $genreId The ID of the genre.
 * @return string|false The name of the genre if found, false otherwise.
 */
    public function getGenreNameById($genreId) {
        $stmt = $this->connection->prepare("SELECT name FROM genre WHERE id = :id");
        $stmt->bindParam(':id', $genreId, PDO::PARAM_INT);
        $stmt->execute();
        $genreName = $stmt->fetchColumn();

        return $genreData = ['name' => $genreName]; /*very important is that */
    }
}
?>
