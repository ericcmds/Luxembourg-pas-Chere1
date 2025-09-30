// CommonJS Server Version
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const fs = require('fs');

// Force production mode
process.env.NODE_ENV = 'production';

const app = express();
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept', 'Access-Control-Allow-Origin'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Additional CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('X-Frame-Options', 'ALLOWALL');
  res.header('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';");
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
  skipSuccessfulRequests: false,
  message: { error: 'Too many requests, please try again later' }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Contact form submission:', { name, email, message });
  res.json({ success: true, message: 'Nachricht erfolgreich gesendet!' });
});

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  console.log('Newsletter subscription:', { email });
  res.json({ success: true, message: 'Newsletter-Anmeldung erfolgreich!' });
});

app.get('/api/cors-test', (req, res) => {
  res.json({
    success: true,
    message: 'CORS-Test erfolgreich',
    headers: req.headers,
    origin: req.headers.origin || 'Keine Origin',
    host: req.headers.host,
    timestamp: new Date().toISOString()
  });
});

// Set custom headers for Service Worker
app.use((req, res, next) => {
  // Service Worker kann auf allen Seiten ausgeführt werden
  res.setHeader('Service-Worker-Allowed', '/');
  next();
});

// Serve service worker (special case to set correct content-type)
app.get('/service-worker.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'public/service-worker.js'));
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file for all routes for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (!res.headersSent) {
    res.status(status).json({ message });
  }
  console.error('Error:', err);
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running in production mode at http://0.0.0.0:${port}`);
});