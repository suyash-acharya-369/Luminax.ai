import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const studySessionSchema = z.object({
	subject: z.string().min(1),
	durationMin: z.number().min(1),
	notes: z.string().optional(),
});

// Get user's study sessions
router.get("/sessions", requireAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const { data, error } = await supabaseAdmin
			.from('study_sessions')
			.select('*')
			.eq('user_id', req.userId!)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching study sessions:', error);
			return res.status(500).json({ error: "Failed to fetch study sessions" });
		}

		res.json({ sessions: data || [] });
	} catch (error) {
		console.error('Study sessions error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Create new study session
router.post("/sessions", requireAuth, async (req: AuthedRequest, res) => {
	try {
		const parsed = studySessionSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
		}

		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

	const { subject, durationMin, notes } = parsed.data;
		
		// Calculate XP based on duration (1 XP per minute)
		const xpEarned = Math.floor(durationMin * 1);

		// Insert study session
		const { data, error } = await supabaseAdmin
			.from('study_sessions')
			.insert({
				user_id: req.userId!,
				subject,
				duration_min: durationMin,
				notes,
				xp_earned: xpEarned,
			})
			.select()
			.single();

		if (error) {
			console.error('Error creating study session:', error);
			return res.status(500).json({ error: "Failed to create study session" });
		}

		// Increment user XP
		const { error: xpError } = await supabaseAdmin.rpc('increment_xp', {
			p_user_id: req.userId!,
			p_amount: xpEarned,
		});

		if (xpError) {
			console.error('Error incrementing XP:', xpError);
		}

		// Update study streak
		const { error: streakError } = await supabaseAdmin.rpc('update_study_streak', {
			p_user_id: req.userId!,
		});

		if (streakError) {
			console.error('Error updating streak:', streakError);
		}

		res.status(201).json({ session: data });
	} catch (error) {
		console.error('Create study session error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get study statistics
router.get("/stats", requireAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		// Get total sessions, minutes, and XP
		const { data: sessions, error: sessionsError } = await supabaseAdmin
			.from('study_sessions')
			.select('duration_min, xp_earned')
			.eq('user_id', req.userId!);

		if (sessionsError) {
			console.error('Error fetching sessions:', sessionsError);
			return res.status(500).json({ error: "Failed to fetch statistics" });
		}

		const totalSessions = sessions?.length || 0;
		const totalMinutes = sessions?.reduce((sum: number, s: any) => sum + (s.duration_min || 0), 0) || 0;
		const totalXp = sessions?.reduce((sum: number, s: any) => sum + (s.xp_earned || 0), 0) || 0;

		// Get user profile for streak info
		const { data: profile } = await supabaseAdmin
			.from('profiles')
			.select('streak, level, xp')
			.eq('id', req.userId!)
			.single();

		res.json({
			totalSessions,
			totalMinutes,
			totalXp,
			streak: profile?.streak || 0,
			level: profile?.level || 1,
			currentXp: profile?.xp || 0,
		});
	} catch (error) {
		console.error('Study stats error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get daily quests
router.get("/daily-quests", requireAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const { data, error } = await supabaseAdmin
			.from('daily_quests')
			.select('*')
			.eq('user_id', req.userId!)
			.eq('completed', false)
			.gte('expires_at', new Date().toISOString())
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching daily quests:', error);
			return res.status(500).json({ error: "Failed to fetch daily quests" });
		}

		res.json({ quests: data || [] });
	} catch (error) {
		console.error('Daily quests error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Create daily quest
router.post("/daily-quests", requireAuth, async (req: AuthedRequest, res) => {
	try {
		const questSchema = z.object({
			questType: z.string(),
			title: z.string(),
			description: z.string().optional(),
			targetValue: z.number().min(1),
			xpReward: z.number().min(1),
		});

		const parsed = questSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
		}

		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const { questType, title, description, targetValue, xpReward } = parsed.data;

		const { data, error } = await supabaseAdmin.rpc('create_daily_quest', {
			p_user_id: req.userId!,
			p_quest_type: questType,
			p_title: title,
			p_description: description,
			p_target_value: targetValue,
			p_xp_reward: xpReward,
		});

		if (error) {
			console.error('Error creating daily quest:', error);
			return res.status(500).json({ error: "Failed to create daily quest" });
		}

		res.status(201).json({ questId: data });
	} catch (error) {
		console.error('Create daily quest error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Update quest progress
router.patch("/daily-quests/:questId/progress", requireAuth, async (req: AuthedRequest, res) => {
	try {
		const { questId } = req.params;
		const progressSchema = z.object({
			increment: z.number().min(1),
		});

		const parsed = progressSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
		}

		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const { increment } = parsed.data;

		// Get current quest
		const { data: quest, error: questError } = await supabaseAdmin
			.from('daily_quests')
			.select('*')
			.eq('id', questId)
			.eq('user_id', req.userId!)
			.single();

		if (questError || !quest) {
			return res.status(404).json({ error: "Quest not found" });
		}

		const newValue = quest.current_value + increment;
		const isCompleted = newValue >= quest.target_value;

		// Update quest
		const { data, error } = await supabaseAdmin
			.from('daily_quests')
			.update({
				current_value: newValue,
				completed: isCompleted,
			})
			.eq('id', questId)
            .select()
            .single();

		if (error) {
			console.error('Error updating quest:', error);
			return res.status(500).json({ error: "Failed to update quest" });
		}

		// If completed, award XP
		if (isCompleted && quest.xp_reward > 0) {
			const { error: xpError } = await supabaseAdmin.rpc('increment_xp', {
				p_user_id: req.userId!,
				p_amount: quest.xp_reward,
			});

			if (xpError) {
				console.error('Error awarding quest XP:', xpError);
			}
		}

		res.json({ quest: data });
	} catch (error) {
		console.error('Update quest progress error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
