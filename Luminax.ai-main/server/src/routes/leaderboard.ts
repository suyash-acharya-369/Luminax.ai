import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { optionalAuth, AuthedRequest } from "../middleware/auth";

const router = Router();

// Get top leaderboard
router.get("/top", optionalAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const { data, error } = await supabaseAdmin
			.from('profiles')
			.select('id, username, xp, level, streak')
			.order('xp', { ascending: false })
			.limit(50);

		if (error) {
			console.error('Error fetching leaderboard:', error);
			return res.status(500).json({ error: "Failed to fetch leaderboard" });
		}

		const leaderboard = (data || []).map((user, index) => ({
			rank: index + 1,
			id: user.id,
			username: user.username || `User${user.id.slice(0, 6)}`,
			xp: user.xp || 0,
			level: user.level || 1,
			streak: user.streak || 0,
			isCurrentUser: req.userId === user.id
		}));

		res.json({ leaderboard });
	} catch (error) {
		console.error('Leaderboard error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get user's rank
router.get("/my-rank", async (req: AuthedRequest, res) => {
	try {
		if (!req.userId) {
			return res.status(401).json({ error: "Authentication required" });
		}

		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		// Get user's XP
		const { data: user, error: userError } = await supabaseAdmin
			.from('profiles')
			.select('xp, username, level, streak')
			.eq('id', req.userId)
			.single();

		if (userError || !user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Count users with higher XP
		const { count, error: countError } = await supabaseAdmin
			.from('profiles')
			.select('*', { count: 'exact', head: true })
			.gt('xp', user.xp || 0);

		if (countError) {
			console.error('Error counting users:', countError);
			return res.status(500).json({ error: "Failed to calculate rank" });
		}

		const rank = (count || 0) + 1;

		res.json({
			rank,
			xp: user.xp || 0,
			level: user.level || 1,
			streak: user.streak || 0,
			username: user.username || `User${req.userId.slice(0, 6)}`
		});
	} catch (error) {
		console.error('My rank error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get community leaderboard
router.get("/community/:communityId", optionalAuth, async (req: AuthedRequest, res) => {
	try {
		const { communityId } = req.params;

		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		// Get community members with their profiles
		const { data, error } = await supabaseAdmin
			.from('community_members')
			.select(`
				profiles!inner(
					id,
					username,
					xp,
					level,
					streak
				)
			`)
			.eq('community_id', communityId)
			.order('profiles(xp)', { ascending: false });

		if (error) {
			console.error('Error fetching community leaderboard:', error);
			return res.status(500).json({ error: "Failed to fetch community leaderboard" });
		}

		const leaderboard = (data || []).map((member: any, index: number) => ({
			rank: index + 1,
			id: member.profiles.id,
			username: member.profiles.username || `User${member.profiles.id.slice(0, 6)}`,
			xp: member.profiles.xp || 0,
			level: member.profiles.level || 1,
			streak: member.profiles.streak || 0,
			isCurrentUser: req.userId === member.profiles.id
		}));

		res.json({ leaderboard });
	} catch (error) {
		console.error('Community leaderboard error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get weekly/monthly leaderboards
router.get("/weekly", optionalAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const weekAgo = new Date();
		weekAgo.setDate(weekAgo.getDate() - 7);

		// Get users with most XP earned this week
		const { data, error } = await supabaseAdmin
			.from('study_sessions')
			.select(`
				user_id,
				xp_earned,
				profiles!inner(
					id,
					username,
					xp,
					level
				)
			`)
			.gte('created_at', weekAgo.toISOString())
			.order('xp_earned', { ascending: false });

		if (error) {
			console.error('Error fetching weekly leaderboard:', error);
			return res.status(500).json({ error: "Failed to fetch weekly leaderboard" });
		}

		// Aggregate XP by user
		const userXpMap = new Map();
		(data || []).forEach(session => {
			const userId = session.user_id;
			const currentXp = userXpMap.get(userId) || 0;
			userXpMap.set(userId, currentXp + (session.xp_earned || 0));
		});

		// Convert to leaderboard format
		const leaderboard = Array.from(userXpMap.entries())
			.map(([userId, weeklyXp]) => {
				const session = (data || []).find((s: any) => s.user_id === userId);
				return {
					id: userId,
					username: (session as any)?.profiles?.username || `User${userId.slice(0, 6)}`,
					weeklyXp,
					level: (session as any)?.profiles?.level || 1,
					isCurrentUser: req.userId === userId
				};
			})
			.sort((a, b) => b.weeklyXp - a.weeklyXp)
			.map((user, index) => ({
				...user,
				rank: index + 1
			}))
			.slice(0, 20); // Top 20

		res.json({ leaderboard });
	} catch (error) {
		console.error('Weekly leaderboard error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get achievements leaderboard
router.get("/achievements", optionalAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		// Get users with most achievements
		const { data, error } = await supabaseAdmin
			.from('achievements')
			.select(`
				user_id,
				profiles!inner(
					id,
					username,
					xp,
					level
				)
			`)
			.order('earned_at', { ascending: false });

		if (error) {
			console.error('Error fetching achievements leaderboard:', error);
			return res.status(500).json({ error: "Failed to fetch achievements leaderboard" });
		}

		// Count achievements per user
		const userAchievementMap = new Map();
		(data || []).forEach(achievement => {
			const userId = achievement.user_id;
			const currentCount = userAchievementMap.get(userId) || 0;
			userAchievementMap.set(userId, currentCount + 1);
		});

		// Convert to leaderboard format
		const leaderboard = Array.from(userAchievementMap.entries())
			.map(([userId, achievementCount]) => {
				const achievement = (data || []).find((a: any) => a.user_id === userId);
				return {
					id: userId,
					username: (achievement as any)?.profiles?.username || `User${userId.slice(0, 6)}`,
					achievementCount,
					xp: (achievement as any)?.profiles?.xp || 0,
					level: (achievement as any)?.profiles?.level || 1,
					isCurrentUser: req.userId === userId
				};
			})
			.sort((a, b) => b.achievementCount - a.achievementCount)
			.map((user, index) => ({
				...user,
				rank: index + 1
			}))
			.slice(0, 20); // Top 20

		res.json({ leaderboard });
	} catch (error) {
		console.error('Achievements leaderboard error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
