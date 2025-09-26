import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import studyRoutes from "./routes/study";
import progressRoutes from "./routes/progress";
import leaderboardRoutes from "./routes/leaderboard";
import communityRoutes from "./routes/community";
import settingsRoutes from "./routes/settings";
import aiRoutes from "./routes/ai";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
	origin: process.env.FRONTEND_URL || "http://localhost:5173",
	credentials: true,
}));
app.use(express.json());
app.use(morgan("combined"));

// Health check
app.get("/health", (_req, res) => {
	res.json({ 
		status: "OK", 
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || "development"
	});
});

// API Routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/study", studyRoutes);
app.use("/progress", progressRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/community", communityRoutes);
app.use("/settings", settingsRoutes);
app.use("/ai", aiRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	console.error('Unhandled error:', err);
	res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use("*", (req, res) => {
	res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
	console.log(`📊 Health check: http://localhost:${PORT}/health`);
	console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
});