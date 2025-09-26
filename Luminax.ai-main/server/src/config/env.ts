import dotenv from "dotenv";

dotenv.config();

export const env = {
	port: process.env.PORT ? Number(process.env.PORT) : 4000,
	jwTSecret: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
	nodeEnv: process.env.NODE_ENV || "development",
	frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
	
	// Supabase
	supabaseUrl: process.env.SUPABASE_URL || "",
	supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
	supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
	
	// OpenAI (for AI features)
	openaiApiKey: process.env.OPENAI_API_KEY || "",
	
	// Database
	databaseUrl: process.env.DATABASE_URL || "file:./prisma/dev.db",
	
	// Feature flags
	features: {
		aiQuizGeneration: Boolean(process.env.OPENAI_API_KEY),
		supabaseIntegration: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
		emailNotifications: Boolean(process.env.EMAIL_SERVICE_KEY),
	},
	
	// Rate limiting
	rateLimit: {
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
	},
	
	// CORS
	cors: {
		origin: process.env.FRONTEND_URL || "http://localhost:5173",
		credentials: true,
	},
} as const;

// Validation
if (!env.jwTSecret || env.jwTSecret === "your-super-secret-jwt-key-change-in-production") {
	console.warn("⚠️  WARNING: Using default JWT secret. Change JWT_SECRET in production!");
}

if (env.nodeEnv === "production") {
	if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
		throw new Error("Supabase configuration required in production");
	}
	
	if (!env.jwTSecret || env.jwTSecret === "your-super-secret-jwt-key-change-in-production") {
		throw new Error("Secure JWT secret required in production");
	}
}