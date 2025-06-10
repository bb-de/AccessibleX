import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnalyticsSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { setupBackupRoutes } from "./backups";
import { setupWidgetRoutes } from './widget-serve';
import { setupWidgetApiRoutes } from './widget-api';

declare module "express-serve-static-core" {
  interface Request {
    session?: {
      id: string;
      [key: string]: any;
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup backup download routes
  setupBackupRoutes(app);

  // Setup widget serving routes
  setupWidgetRoutes(app);

  // Setup widget API routes
  setupWidgetApiRoutes(app);
  // API route for recording accessibility analytics
  app.post("/api/analytics/setting-change", async (req, res) => {
    try {
      const data = {
        userId: null, // Anonymous analytics in this case
        sessionId: req.session?.id || "anonymous",
        event: "setting_change",
        data: req.body,
        userAgent: req.headers["user-agent"] || ""
      };

      const validatedData = insertAnalyticsSchema.parse(data);
      const result = await storage.createAnalyticsEvent(validatedData);

      res.status(200).json({ success: true, id: result.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data format", details: fromZodError(error).message });
      } else {
        console.error("Error recording setting change analytics:", error);
        res.status(500).json({ error: "Failed to record analytics" });
      }
    }
  });

  app.post("/api/analytics/profile-applied", async (req, res) => {
    try {
      const data = {
        userId: null, // Anonymous analytics in this case
        sessionId: req.session?.id || "anonymous",
        event: "profile_applied",
        data: req.body,
        userAgent: req.headers["user-agent"] || ""
      };

      const validatedData = insertAnalyticsSchema.parse(data);
      const result = await storage.createAnalyticsEvent(validatedData);

      res.status(200).json({ success: true, id: result.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data format", details: fromZodError(error).message });
      } else {
        console.error("Error recording profile applied analytics:", error);
        res.status(500).json({ error: "Failed to record analytics" });
      }
    }
  });

  app.post("/api/analytics/settings-reset", async (req, res) => {
    try {
      const data = {
        userId: null, // Anonymous analytics in this case
        sessionId: req.session?.id || "anonymous",
        event: "settings_reset",
        data: {},
        userAgent: req.headers["user-agent"] || ""
      };

      const validatedData = insertAnalyticsSchema.parse(data);
      const result = await storage.createAnalyticsEvent(validatedData);

      res.status(200).json({ success: true, id: result.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data format", details: fromZodError(error).message });
      } else {
        console.error("Error recording settings reset analytics:", error);
        res.status(500).json({ error: "Failed to record analytics" });
      }
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}