import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactSchema, newsletterSchema, anthropicRequestSchema, geminiRequestSchema } from "@shared/schema";
import rateLimit from 'express-rate-limit';
import { ZodError } from "zod";
import axios from 'axios';

const contactLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 requests per minute
  message: { error: "Too many contact form submissions, please try again later" }
});

const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  message: { error: "Too many newsletter subscriptions, please try again later" }
});

const anthropicLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 requests per minute
  message: { error: "Too many Anthropic API requests, please try again later" }
});

const geminiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 requests per minute
  message: { error: "Too many Gemini API requests, please try again later" }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form endpoint
  app.post("/api/contact", contactLimiter, async (req: Request, res: Response) => {
    try {
      const validatedData = contactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json({ success: true, message: "Contact form submitted successfully", data: contact });
    } catch (error: unknown) {
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

  // Newsletter subscription endpoint
  app.post("/api/newsletter", newsletterLimiter, async (req: Request, res: Response) => {
    try {
      const validatedData = newsletterSchema.parse(req.body);
      const newsletter = await storage.createNewsletter(validatedData);
      res.status(201).json({ success: true, message: "Newsletter subscription successful", data: newsletter });
    } catch (error: unknown) {
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

  // Anthropic API proxy endpoint
  app.post("/api/anthropic", anthropicLimiter, async (req: Request, res: Response) => {
    try {
      const validatedData = anthropicRequestSchema.parse(req.body);

      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        console.error("ANTHROPIC_API_KEY environment variable is not set");
        return res.status(500).json({
          success: false,
          message: "Server configuration error"
        });
      }

      const response = await axios.post(
        "https://api.anthropic.com/v1/messages",
        {
          model: "claude-3-sonnet-20240229",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: validatedData.prompt
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01"
          },
          timeout: 30000 // 30 second timeout
        }
      );

      res.status(200).json({
        success: true,
        message: "Anthropic API request successful",
        data: response.data
      });

    } catch (error: unknown) {
      console.error("Anthropic API request error:", error);

      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      }

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          return res.status(429).json({
            success: false,
            message: "Rate limit exceeded - please try again later"
          });
        }

        if (error.response?.status === 401) {
          console.error("Invalid Anthropic API key");
          return res.status(500).json({
            success: false,
            message: "Server configuration error"
          });
        }

        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          return res.status(502).json({
            success: false,
            message: "Unable to connect to Anthropic API"
          });
        }

        return res.status(502).json({
          success: false,
          message: "Anthropic API request failed"
        });
      }

      res.status(500).json({
        success: false,
        message: "An internal server error occurred"
      });
    }
  });

  // Gemini API proxy endpoint
  app.post("/api/gemini", geminiLimiter, async (req: Request, res: Response) => {
    try {
      const validatedData = geminiRequestSchema.parse(req.body);

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("GEMINI_API_KEY environment variable is not set");
        return res.status(500).json({
          success: false,
          message: "Server configuration error"
        });
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: validatedData.prompt
                }
              ]
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
          timeout: 30000 // 30 second timeout
        }
      );

      res.status(200).json({
        success: true,
        message: "Gemini API request successful",
        data: response.data
      });

    } catch (error: unknown) {
      console.error("Gemini API request error:", error);

      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors
        });
      }

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          return res.status(429).json({
            success: false,
            message: "Rate limit exceeded - please try again later"
          });
        }

        if (error.response?.status === 401) {
          console.error("Invalid Gemini API key");
          return res.status(500).json({
            success: false,
            message: "Server configuration error"
          });
        }

        if (error.response?.status === 403) {
          console.error("Gemini API access forbidden - check API key permissions");
          return res.status(500).json({
            success: false,
            message: "Server configuration error"
          });
        }

        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          return res.status(502).json({
            success: false,
            message: "Unable to connect to Gemini API"
          });
        }

        return res.status(502).json({
          success: false,
          message: "Gemini API request failed"
        });
      }

      res.status(500).json({
        success: false,
        message: "An internal server error occurred"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
