<?php

class ConversationRequestHandler
{
    private $connection;

    public function __construct()
    {
        $this->connection = (new Db())->getConnection();
    }

    public function getOrCreateConversation(int $user1_id, int $user2_id): ?int
    {
        // Гарантираме фиксиран ред (по-малкият ID винаги е user1)
        $a = min($user1_id, $user2_id);
        $b = max($user1_id, $user2_id);

        // Проверка за съществуваща връзка
        $stmt = $this->connection->prepare("
            SELECT id FROM conversations 
            WHERE user1_id = :a AND user2_id = :b
        ");
        $stmt->execute(['a' => $a, 'b' => $b]);
        $result = $stmt->fetch();

        if ($result) {
            return (int)$result['id'];
        }

        // Създаване на нова връзка, ако няма
        $insert = $this->connection->prepare("
            INSERT INTO conversations (user1_id, user2_id)
            VALUES (:a, :b)
        ");
        $insert->execute(['a' => $a, 'b' => $b]);

        return (int)$this->connection->lastInsertId();
    }
}
