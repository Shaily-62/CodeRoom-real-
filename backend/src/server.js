import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { collaborationServer } from "./config/collaborationServer.js";

const PORT = process.env.PORT || 5000;

const startServers = async () => {
  try {
    // Start Express API server
    app.listen(PORT, () => {
      console.log("--------------------------------");
      console.log("       CodeRoom Backend");
      console.log("--------------------------------");
      console.log(`API server running on port ${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
    });

    // Start Hocuspocus WebSocket server
    await collaborationServer.listen();

    console.log("--------------------------------");
    console.log("  CodeRoom Collaboration Server");
    console.log("--------------------------------");
    console.log("WebSocket server running on port 1234");
    console.log("Address: ws://127.0.0.1:1234");
  } catch (error) {
    console.error("Failed to start CodeRoom servers:", error);
    process.exit(1);
  }
};

startServers();
