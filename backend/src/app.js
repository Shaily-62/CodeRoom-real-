import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { supabase } from "./config/supabase.js";

//importing routes
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import invitationRoutes from "./routes/invitation.routes.js";
import teamRoutes from "./routes/team.routes.js";
import fileRoutes from "./routes/file.routes.js";

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Log incoming HTTP requests
app.use(morgan("dev"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CodeRoom backend is running!",
    timestamp: new Date().toISOString(),
  });
});

// Supabase connectivity test
app.get("/api/health/supabase", async (req, res, next) => {
  try {
    const { error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Supabase client initialized successfully!",
      service: "Supabase Auth",
    });
  } catch (error) {
    next(error);
  }
});

//all apis
app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);
app.use("/api/projects", fileRoutes);
app.use("/api/projects", teamRoutes);

app.use("/api", invitationRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;
