import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const updateProfileSchema = z.object({
	username: z.string().min(3).max(20).optional(),
	bio: z.string().max(500).optional(),
});

// Get current user profile
router.get("/me", requireAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const { data, error } = await supabaseAdmin
			.from('profiles')
			.select('*')
			.eq('id', req.userId!)
			.single();

		if (error) {
			console.error('Error fetching user profile:', error);
			return res.status(500).json({ error: "Failed to fetch user profile" });
		}

		if (!data) {
			// Create profile if it doesn't exist
			const { data: newProfile, error: createError } = await supabaseAdmin
				.from('profiles')
				.insert({
					id: req.userId!,
					email: req.user?.email || '',
					username: `User${req.userId!.slice(0, 6)}`,
				})
				.select()
				.single();

			if (createError) {
				console.error('Error creating user profile:', createError);
				return res.status(500).json({ error: "Failed to create user profile" });
			}

			return res.json({ profile: newProfile });
		}

		res.json({ profile: data });
	} catch (error) {
		console.error('Get user profile error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Update user profile
router.patch("/me", requireAuth, async (req: AuthedRequest, res) => {
	try {
		const parsed = updateProfileSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
		}

		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const updateData = parsed.data;

		// Check if username is already taken
		if (updateData.username) {
			const { data: existingUser } = await supabaseAdmin
				.from('profiles')
				.select('id')
				.eq('username', updateData.username)
				.neq('id', req.userId!)
				.single();

			if (existingUser) {
				return res.status(400).json({ error: "Username already taken" });
			}
		}

		const { data, error } = await supabaseAdmin
			.from('profiles')
			.update({
				...updateData,
				updated_at: new Date().toISOString(),
			})
			.eq('id', req.userId!)
			.select()
			.single();

		if (error) {
			console.error('Error updating user profile:', error);
			return res.status(500).json({ error: "Failed to update user profile" });
		}

		res.json({ profile: data });
	} catch (error) {
		console.error('Update user profile error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get user achievements
router.get("/me/achievements", requireAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const { data, error } = await supabaseAdmin
			.from('achievements')
			.select('*')
			.eq('user_id', req.userId!)
			.order('earned_at', { ascending: false });

		if (error) {
			console.error('Error fetching user achievements:', error);
			return res.status(500).json({ error: "Failed to fetch achievements" });
		}

		res.json({ achievements: data || [] });
	} catch (error) {
		console.error('Get user achievements error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Add achievement
router.post("/me/achievements", requireAuth, async (req: AuthedRequest, res) => {
	try {
		const achievementSchema = z.object({
			achievementType: z.string(),
			title: z.string(),
			description: z.string().optional(),
			xpReward: z.number().min(0).optional(),
		});

		const parsed = achievementSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
		}

		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const { achievementType, title, description, xpReward = 0 } = parsed.data;

		const { data, error } = await supabaseAdmin
			.from('achievements')
			.insert({
				user_id: req.userId!,
				achievement_type: achievementType,
				title,
				description,
				xp_reward: xpReward,
			})
			.select()
			.single();

		if (error) {
			console.error('Error creating achievement:', error);
			return res.status(500).json({ error: "Failed to create achievement" });
		}

		// Award XP if specified
		if (xpReward > 0) {
			const { error: xpError } = await supabaseAdmin.rpc('increment_xp', {
				p_user_id: req.userId!,
				p_amount: xpReward,
			});

			if (xpError) {
				console.error('Error awarding achievement XP:', xpError);
			}
		}

		res.status(201).json({ achievement: data });
	} catch (error) {
		console.error('Create achievement error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get user's study sessions
router.get("/me/sessions", requireAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const { data, error } = await supabaseAdmin
			.from('study_sessions')
			.select('*')
			.eq('user_id', req.userId!)
			.order('created_at', { ascending: false })
			.limit(100);

		if (error) {
			console.error('Error fetching user sessions:', error);
			return res.status(500).json({ error: "Failed to fetch study sessions" });
		}

		res.json({ sessions: data || [] });
	} catch (error) {
		console.error('Get user sessions error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get user's quiz results
router.get("/me/quiz-results", requireAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const { data, error } = await supabaseAdmin
			.from('quiz_results')
			.select('*')
			.eq('user_id', req.userId!)
			.order('created_at', { ascending: false })
			.limit(50);

		if (error) {
			console.error('Error fetching quiz results:', error);
			return res.status(500).json({ error: "Failed to fetch quiz results" });
		}

		res.json({ quizResults: data || [] });
	} catch (error) {
		console.error('Get quiz results error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Submit quiz result
router.post("/me/quiz-results", requireAuth, async (req: AuthedRequest, res) => {
	try {
		const quizResultSchema = z.object({
			quizId: z.string(),
			topic: z.string(),
			score: z.number().min(0).max(100),
			totalQuestions: z.number().min(1),
			xpEarned: z.number().min(0).optional(),
		});

		const parsed = quizResultSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
		}

		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const { quizId, topic, score, totalQuestions, xpEarned = Math.floor(score / 10) * 10 } = parsed.data;

		const { data, error } = await supabaseAdmin
			.from('quiz_results')
			.insert({
				user_id: req.userId!,
				quiz_id: quizId,
				topic,
				score,
				total_questions: totalQuestions,
				xp_earned: xpEarned,
			})
			.select()
			.single();

		if (error) {
			console.error('Error creating quiz result:', error);
			return res.status(500).json({ error: "Failed to create quiz result" });
		}

		// Award XP
		if (xpEarned > 0) {
			const { error: xpError } = await supabaseAdmin.rpc('increment_xp', {
				p_user_id: req.userId!,
				p_amount: xpEarned,
			});

			if (xpError) {
				console.error('Error awarding quiz XP:', xpError);
			}
		}

		res.status(201).json({ quizResult: data });
	} catch (error) {
		console.error('Create quiz result error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
