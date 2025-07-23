// backend/src/middleware/corsConfig.js
const corsConfig = {
  origin: 'http://localhost:5173', // Default Vite dev server port
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = { corsConfig };