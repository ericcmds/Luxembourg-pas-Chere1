// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  contacts;
  newsletters;
  userCurrentId;
  contactCurrentId;
  newsletterCurrentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.contacts = /* @__PURE__ */ new Map();
    this.newsletters = /* @__PURE__ */ new Map();
    this.userCurrentId = 1;
    this.contactCurrentId = 1;
    this.newsletterCurrentId = 1;
  }
  // User methods (kept from template)
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userCurrentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Contact methods
  async createContact(insertContact) {
    const id = this.contactCurrentId++;
    const contact = {
      ...insertContact,
      id,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.contacts.set(id, contact);
    return contact;
  }
  async getContacts() {
    return Array.from(this.contacts.values());
  }
  // Newsletter methods
  async createNewsletter(insertNewsletter) {
    const existingEmail = Array.from(this.newsletters.values()).find(
      (newsletter2) => newsletter2.email === insertNewsletter.email
    );
    if (existingEmail) {
      return existingEmail;
    }
    const id = this.newsletterCurrentId++;
    const newsletter = {
      ...insertNewsletter,
      id,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }
  async getNewsletters() {
    return Array.from(this.newsletters.values());
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var contactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  message: true
}).extend({
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long")
});
var newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var newsletterSchema = createInsertSchema(newsletters).pick({
  email: true
}).extend({
  email: z.string().email("Please enter a valid email address")
});

// server/routes.ts
import rateLimit from "express-rate-limit";
import { ZodError } from "zod";
var contactLimiter = rateLimit({
  windowMs: 60 * 1e3,
  // 1 minute
  max: 3,
  // 3 requests per minute
  message: { error: "Too many contact form submissions, please try again later" }
});
var newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1e3,
  // 1 hour
  max: 5,
  // 5 requests per hour
  message: { error: "Too many newsletter subscriptions, please try again later" }
});
async function registerRoutes(app2) {
  app2.post("/api/contact", contactLimiter, async (req, res) => {
    try {
      const validatedData = contactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json({ success: true, message: "Contact form submitted successfully", data: contact });
    } catch (error) {
      console.error("Contact form submission error:", error);
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      }
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  app2.post("/api/newsletter", newsletterLimiter, async (req, res) => {
    try {
      const validatedData = newsletterSchema.parse(req.body);
      const newsletter = await storage.createNewsletter(validatedData);
      res.status(201).json({ success: true, message: "Newsletter subscription successful", data: newsletter });
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      }
      res.status(400).json({ success: false, message: "Invalid newsletter subscription data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  server: {
    host: "0.0.0.0",
    hmr: {
      host: "0.0.0.0",
      clientPort: 443,
      protocol: "wss"
    },
    cors: true,
    allowedHosts: ["cacb4935-ed61-4c2a-9a5f-dbaf271a9137-00-1cyyybjqfpe24.spock.replit.dev", "all"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: {
      server,
      host: "0.0.0.0",
      clientPort: 443,
      protocol: "wss",
      timeout: 12e4
    },
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true
    },
    fs: {
      strict: false,
      allow: [".."]
    },
    allowedHosts: "*"
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: {
      ...serverOptions,
      // Use serverOptions for consistency
      host: "0.0.0.0"
      // Added: host for the server
    },
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import cors from "cors";
import rateLimit2 from "express-rate-limit";

// server/allowedHosts.ts
var bypassHostCheck = (req, res, next) => {
  try {
    const isDevMode = process.env.NODE_ENV !== "production";
    const isViteRequest = req.path.includes("/@vite/") || req.path.includes("/@fs/") || req.path.includes("/@id/") || req.headers.referer?.includes("__replco/workspace_iframe");
    if (isViteRequest) {
      console.log(`\u{1F50D} Request Host: ${req.headers.host}`);
      console.log(`\u{1F50D} Origin: ${req.headers.origin}`);
      console.log(`\u{1F50D} Referer: ${req.headers.referer}`);
    }
    if (req.headers && req.headers.host && isDevMode) {
      const allowedHost = "localhost:5000";
      if (isViteRequest) {
        console.log(`\u{1F504} Changing host from ${req.headers.host} to ${allowedHost}`);
      }
      req.headers.host = allowedHost;
      if (req.headers.referer && req.headers.referer.includes("/@vite/client")) {
        req.headers["cache-control"] = "no-cache, no-store, must-revalidate";
        req.headers["pragma"] = "no-cache";
      }
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    if (req.headers.upgrade === "websocket") {
      req.headers.host = "localhost:5000";
    }
    next();
  } catch (error) {
    console.error("\u274C Error in bypassHostCheck middleware:", error);
    next();
  }
};

// server/index.ts
process.env.NODE_ENV = "development";
process.env.VITE_ALLOWED_HOSTS = "*";
process.env.VITE_DISABLE_HOST_CHECK = "true";
process.env.VITE_HOST_CHECK = "false";
process.env.VITE_ALLOW_ALL_HOSTS = "true";
var app = express2();
app.set("trust proxy", 1);
app.use(bypassHostCheck);
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Origin", "Accept", "Access-Control-Allow-Origin"],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("X-Frame-Options", "ALLOWALL");
  res.header("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});
app.get("/api/cors-test", (req, res) => {
  res.json({
    success: true,
    message: "CORS-Test erfolgreich",
    headers: req.headers,
    origin: req.headers.origin || "Keine Origin",
    host: req.headers.host,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.use(rateLimit2({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 100,
  // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
  skipSuccessfulRequests: false,
  message: { error: "Too many requests, please try again later" }
}));
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    console.error("Error:", err);
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
    console.log(`Server running at http://0.0.0.0:${port}`);
    console.log("WebSocket server ready");
  });
  process.on("SIGTERM", () => {
    console.log("Shutting down server...");
    server.close(() => {
      console.log("Server shut down");
      process.exit(0);
    });
  });
})();
