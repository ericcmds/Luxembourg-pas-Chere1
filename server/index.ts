import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, log, serveStatic } from "./vite";
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { bypassHostCheck } from "./allowedHosts";

// Force development mode for Vite
process.env.NODE_ENV = 'development';

// Spezifische Vite-Host-Einstellungen
process.env.VITE_ALLOWED_HOSTS = "*";
process.env.VITE_DISABLE_HOST_CHECK = "true";
process.env.VITE_HOST_CHECK = "false";
process.env.VITE_ALLOW_ALL_HOSTS = "true";

// CORS Security Configuration
// Parse ALLOWED_ORIGINS environment variable (comma-separated)
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'];

// Origin validation function for CORS
const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
};

// CORS configuration function
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

const app = express();
app.set('trust proxy', 1);

// Host-Bypass-Middleware als erstes einbinden
app.use(bypassHostCheck);

// Secure CORS configuration with environment-based allowed origins
app.use(cors(corsOptions));

// Simplified headers - CORS is now handled by cors middleware
app.use((req, res, next) => {
  // Content Security Policy für WebViews (keeping existing CSP for compatibility)
  res.header('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';");

  next();
});

// Test-Route für CORS
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
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
  skipSuccessfulRequests: false,
  message: { error: "Too many requests, please try again later" }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    console.error('Error:', err);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // serve on port 3000 for development
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  server.listen({
    port,
    host: "127.0.0.1",
  }, () => {
    log(`serving on port ${port}`);
    console.log(`Server running at http://127.0.0.1:${port}`);
    console.log('WebSocket server ready');
  });

  process.on('SIGTERM', () => {
    console.log('Shutting down server...');
    server.close(() => {
      console.log('Server shut down');
      process.exit(0);
    });
  });
})();
