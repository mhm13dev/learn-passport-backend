require('dotenv').config();
const http = require('http');
const app = require('./app');
const terminate = require('./utils/terminate');

// Database Connection
require('./db/connection');

// HTTP Server
const server = http.createServer(app);

// Gracefull Shutdown of Server Starts
const exitHandler = terminate(server, {
  timeout: 500,
});

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'));
process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
process.on('SIGINT', exitHandler(0, 'SIGINT'));
// Gracefull Shutdown of Server Starts

// Start Server Listening
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
