const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3000 });

const clients = new Map(); // client => songId

wss.on("connection", (ws) => {
  console.log("🔌 Client connected");

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      if (data.type === "subscribe") {
        clients.set(ws, data.songId);
      }

      if (data.type === "new_comment") {
        const songId = clients.get(ws);
        const message = {
          type: "broadcast_comment",
          songId: songId,
          username: data.username,
          message: data.message,
          timestamp: new Date().toLocaleTimeString(),
        };

        for (let [client, id] of clients.entries()) {
          if (id === songId && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        }
      }
    } catch (err) {
      console.error("❌ Invalid message:", err);
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("❎ Client disconnected");
  });
});

console.log("✅ WebSocket server running on ws://localhost:3000");
