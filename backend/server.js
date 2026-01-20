const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import ES modules using dynamic import
async function startServer() {
  dotenv.config();

  const app = express();
  const PORT = process.env.PORT || 10000;

  // Middleware
  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Serve static files for Mini App
  app.use(express.static('public'));

  // Basic API routes
  app.get('/api', (req, res) => {
    res.json({ message: 'IkonGrind API is running!' });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
    });
  });

  // Start server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════╗
║        IkonGrind Backend Server        ║
╚════════════════════════════════════════╝

✓ Server running on port ${PORT}
✓ Environment: ${process.env.NODE_ENV || 'development'}

Press Ctrl+C to stop
    `);
  });
}

startServer().catch(console.error);
