import { Router } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { supabaseAdmin } from "../lib/supabase";
import { z } from "zod";

const router = Router();

const registerSchema = z.object({
	email: z.string().email(),
	username: z.string().min(3).max(20),
	password: z.string().min(6),
});

const loginSchema = z.object({
	identifier: z.string(), // email or username
	password: z.string(),
});

// Register endpoint
router.post("/register", async (req, res) => {
	try {
		const parsed = registerSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
		}

		const { email, username, password } = parsed.data;

		// Use Supabase if available
		if (supabaseAdmin) {
			const { data, error } = await supabaseAdmin.auth.admin.createUser({
				email,
				password,
				email_confirm: true,
			});

			if (error) {
				return res.status(400).json({ error: error.message });
			}

			// Create profile
			const { error: profileError } = await supabaseAdmin
				.from('profiles')
				.insert({
					id: data.user.id,
					username,
					email,
				});

			if (profileError) {
				console.error('Profile creation error:', profileError);
				// Continue anyway, profile can be created later
			}

			// Generate JWT token
			const token = jwt.sign(
				{ sub: data.user.id, email: data.user.email },
				env.jwTSecret,
				{ expiresIn: '7d' }
			);

			return res.json({
				user: data.user,
				token,
				message: "Registration successful"
			});
		}

		// Fallback: simple registration without Supabase
		const token = jwt.sign(
			{ sub: email, email },
			env.jwTSecret,
			{ expiresIn: '7d' }
		);

		res.json({
			user: { id: email, email, username },
			token,
			message: "Registration successful (local mode)"
		});
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({ error: "Registration failed" });
	}
});

// Login endpoint
router.post("/login", async (req, res) => {
	try {
		const parsed = loginSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
		}

		const { identifier, password } = parsed.data;

		// Use Supabase if available
		if (supabaseAdmin) {
			// Try to find user by email first
			let user;
			const { data: usersByEmail } = await supabaseAdmin
				.from('profiles')
				.select('email')
				.eq('email', identifier)
				.single();

			if (usersByEmail) {
				const { data, error } = await supabaseAdmin.auth.signInWithPassword({
					email: usersByEmail.email,
					password,
				});

				if (error) {
					return res.status(401).json({ error: "Invalid credentials" });
				}

				user = data.user;
			} else {
				// Try by username
				const { data: usersByUsername } = await supabaseAdmin
					.from('profiles')
					.select('email')
					.eq('username', identifier)
					.single();

				if (!usersByUsername) {
					return res.status(401).json({ error: "Invalid credentials" });
				}

				const { data, error } = await supabaseAdmin.auth.signInWithPassword({
					email: usersByUsername.email,
					password,
				});

				if (error) {
					return res.status(401).json({ error: "Invalid credentials" });
				}

				user = data.user;
			}

			// Generate JWT token
			const token = jwt.sign(
				{ sub: user.id, email: user.email },
				env.jwTSecret,
				{ expiresIn: '7d' }
			);

			return res.json({
				user,
				token,
				message: "Login successful"
			});
		}

		// Fallback: simple login without Supabase
		const token = jwt.sign(
			{ sub: identifier, email: identifier },
			env.jwTSecret,
			{ expiresIn: '7d' }
		);

		res.json({
			user: { id: identifier, email: identifier },
			token,
			message: "Login successful (local mode)"
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ error: "Login failed" });
	}
});

// Logout endpoint
router.post("/logout", async (req, res) => {
	try {
		// In a real app, you might want to blacklist the token
		res.json({ message: "Logout successful" });
	} catch (error) {
		console.error('Logout error:', error);
		res.status(500).json({ error: "Logout failed" });
	}
});

// Get current user
router.get("/me", async (req, res) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			return res.status(401).json({ error: "No token provided" });
		}

		const token = authHeader.replace("Bearer ", "");

		if (supabaseAdmin) {
			const { data, error } = await supabaseAdmin.auth.getUser(token);
			if (error || !data.user) {
				return res.status(401).json({ error: "Invalid token" });
			}

			// Get profile data
			const { data: profile } = await supabaseAdmin
				.from('profiles')
				.select('*')
				.eq('id', data.user.id)
				.single();

			return res.json({
				user: data.user,
				profile: profile || {}
			});
		}

		// Fallback
		const payload = jwt.verify(token, env.jwTSecret) as any;
		res.json({
			user: { id: payload.sub, email: payload.email },
			profile: {}
		});
	} catch (error) {
		console.error('Get user error:', error);
		res.status(401).json({ error: "Invalid token" });
	}
});

export default router;