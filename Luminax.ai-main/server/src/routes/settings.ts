import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const settingsSchema = z.object({
	notifications: z.object({
		email: z.boolean().optional(),
		push: z.boolean().optional(),
		studyReminders: z.boolean().optional(),
		achievements: z.boolean().optional(),
	}).optional(),
	privacy: z.object({
		profilePublic: z.boolean().optional(),
		showProgress: z.boolean().optional(),
		showAchievements: z.boolean().optional(),
	}).optional(),
	study: z.object({
		dailyGoal: z.number().min(0).max(24).optional(),
		breakReminder: z.number().min(5).max(60).optional(),
		theme: z.enum(['light', 'dark', 'auto']).optional(),
	}).optional(),
});

// Get user settings
router.get("/", requireAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		// For now, return default settings since we don't have a settings table
		// In a real app, you'd store these in a user_settings table
		const defaultSettings = {
			notifications: {
				email: true,
				push: true,
				studyReminders: true,
				achievements: true,
			},
			privacy: {
				profilePublic: true,
				showProgress: true,
				showAchievements: true,
			},
			study: {
				dailyGoal: 2, // hours
				breakReminder: 25, // minutes
				theme: 'auto',
			},
		};

		res.json({ settings: defaultSettings });
	} catch (error) {
		console.error('Get settings error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Update user settings
router.patch("/", requireAuth, async (req: AuthedRequest, res) => {
	try {
		const parsed = settingsSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
		}

		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		// For now, just return the updated settings
		// In a real app, you'd save these to a user_settings table
		const updatedSettings = {
			notifications: {
				email: parsed.data.notifications?.email ?? true,
				push: parsed.data.notifications?.push ?? true,
				studyReminders: parsed.data.notifications?.studyReminders ?? true,
				achievements: parsed.data.notifications?.achievements ?? true,
			},
			privacy: {
				profilePublic: parsed.data.privacy?.profilePublic ?? true,
				showProgress: parsed.data.privacy?.showProgress ?? true,
				showAchievements: parsed.data.privacy?.showAchievements ?? true,
			},
			study: {
				dailyGoal: parsed.data.study?.dailyGoal ?? 2,
				breakReminder: parsed.data.study?.breakReminder ?? 25,
				theme: parsed.data.study?.theme ?? 'auto',
			},
		};

		res.json({ settings: updatedSettings });
	} catch (error) {
		console.error('Update settings error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get user preferences
router.get("/preferences", requireAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		// Get user profile for preferences
		const { data: profile, error: profileError } = await supabaseAdmin
			.from('profiles')
			.select('username, bio, level, xp')
			.eq('id', req.userId!)
			.single();

		if (profileError) {
			console.error('Error fetching profile for preferences:', profileError);
			return res.status(500).json({ error: "Failed to fetch preferences" });
		}

		const preferences = {
			profile: {
				username: profile?.username || `User${req.userId!.slice(0, 6)}`,
				bio: profile?.bio || '',
				level: profile?.level || 1,
				xp: profile?.xp || 0,
			},
			study: {
				favoriteSubjects: ['Mathematics', 'Physics', 'Chemistry'], // Mock data
				studyStreak: profile?.level || 0,
				preferredStudyTime: 'Morning',
			},
			notifications: {
				enabled: true,
				types: ['achievements', 'reminders', 'community'],
			},
		};

		res.json({ preferences });
	} catch (error) {
		console.error('Get preferences error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Update user preferences
router.patch("/preferences", requireAuth, async (req: AuthedRequest, res) => {
	try {
		const preferencesSchema = z.object({
			profile: z.object({
				username: z.string().min(3).max(20).optional(),
				bio: z.string().max(500).optional(),
			}).optional(),
			study: z.object({
				favoriteSubjects: z.array(z.string()).optional(),
				preferredStudyTime: z.string().optional(),
			}).optional(),
			notifications: z.object({
				enabled: z.boolean().optional(),
				types: z.array(z.string()).optional(),
			}).optional(),
		});

		const parsed = preferencesSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
		}

		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		// Update profile if provided
		if (parsed.data.profile) {
			const { data, error } = await supabaseAdmin
				.from('profiles')
				.update({
					username: parsed.data.profile.username,
					bio: parsed.data.profile.bio,
					updated_at: new Date().toISOString(),
				})
				.eq('id', req.userId!)
				.select()
				.single();

			if (error) {
				console.error('Error updating profile preferences:', error);
				return res.status(500).json({ error: "Failed to update preferences" });
			}
		}

		// For now, just return success since we don't have separate preferences storage
		res.json({ message: "Preferences updated successfully" });
	} catch (error) {
		console.error('Update preferences error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Export user data
router.get("/export", requireAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		// Get all user data
		const [profileResult, sessionsResult, quizResultsResult, achievementsResult] = await Promise.all([
			supabaseAdmin.from('profiles').select('*').eq('id', req.userId!).single(),
			supabaseAdmin.from('study_sessions').select('*').eq('user_id', req.userId!),
			supabaseAdmin.from('quiz_results').select('*').eq('user_id', req.userId!),
			supabaseAdmin.from('achievements').select('*').eq('user_id', req.userId!),
		]);

		const exportData = {
			profile: profileResult.data,
			studySessions: sessionsResult.data || [],
			quizResults: quizResultsResult.data || [],
			achievements: achievementsResult.data || [],
			exportedAt: new Date().toISOString(),
		};

		res.json({ data: exportData });
	} catch (error) {
		console.error('Export data error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Delete user account
router.delete("/account", requireAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		// Delete user data (cascade should handle related records)
		const { error } = await supabaseAdmin
			.from('profiles')
			.delete()
			.eq('id', req.userId!);

		if (error) {
			console.error('Error deleting user account:', error);
			return res.status(500).json({ error: "Failed to delete account" });
		}

		res.json({ message: "Account deleted successfully" });
	} catch (error) {
		console.error('Delete account error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
