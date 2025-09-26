import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { requireAuth, AuthedRequest } from "../middleware/auth";

const router = Router();

// Get progress summary
router.get("/summary", requireAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		// Get user profile
		const { data: profile, error: profileError } = await supabaseAdmin
			.from('profiles')
			.select('xp, level, streak, last_study_date')
			.eq('id', req.userId!)
			.single();

		if (profileError) {
			console.error('Error fetching profile:', profileError);
			return res.status(500).json({ error: "Failed to fetch profile" });
		}

		// Get study sessions
		const { data: sessions, error: sessionsError } = await supabaseAdmin
			.from('study_sessions')
			.select('duration_min, xp_earned, created_at')
			.eq('user_id', req.userId!)
			.order('created_at', { ascending: false });

		if (sessionsError) {
			console.error('Error fetching sessions:', sessionsError);
			return res.status(500).json({ error: "Failed to fetch sessions" });
		}

		// Get quiz results
		const { data: quizResults, error: quizError } = await supabaseAdmin
			.from('quiz_results')
			.select('score, xp_earned, created_at')
			.eq('user_id', req.userId!)
			.order('created_at', { ascending: false });

		if (quizError) {
			console.error('Error fetching quiz results:', quizError);
			return res.status(500).json({ error: "Failed to fetch quiz results" });
		}

		// Get achievements
		const { data: achievements, error: achievementsError } = await supabaseAdmin
			.from('achievements')
			.select('achievement_type, title, xp_reward, earned_at')
			.eq('user_id', req.userId!)
			.order('earned_at', { ascending: false });

		if (achievementsError) {
			console.error('Error fetching achievements:', achievementsError);
			return res.status(500).json({ error: "Failed to fetch achievements" });
		}

		// Calculate statistics
		const totalSessions = sessions?.length || 0;
		const totalMinutes = sessions?.reduce((sum: number, s: any) => sum + (s.duration_min || 0), 0) || 0;
		const totalStudyXp = sessions?.reduce((sum: number, s: any) => sum + (s.xp_earned || 0), 0) || 0;
		const totalQuizXp = quizResults?.reduce((sum: number, q: any) => sum + (q.xp_earned || 0), 0) || 0;
		const totalAchievementXp = achievements?.reduce((sum: number, a: any) => sum + (a.xp_reward || 0), 0) || 0;
		const totalXp = totalStudyXp + totalQuizXp + totalAchievementXp;

		// Calculate average quiz score
		const averageQuizScore = quizResults?.length > 0 
			? quizResults.reduce((sum: number, q: any) => sum + (q.score || 0), 0) / quizResults.length 
			: 0;

		// Get recent activity (last 7 days)
		const weekAgo = new Date();
		weekAgo.setDate(weekAgo.getDate() - 7);

		const recentSessions = sessions?.filter(s => 
			new Date(s.created_at) >= weekAgo
		) || [];

		const recentQuizResults = quizResults?.filter(q => 
			new Date(q.created_at) >= weekAgo
		) || [];

		// Calculate weekly stats
		const weeklyMinutes = recentSessions.reduce((sum: number, s: any) => sum + (s.duration_min || 0), 0);
		const weeklyXp = recentSessions.reduce((sum: number, s: any) => sum + (s.xp_earned || 0), 0) +
						recentQuizResults.reduce((sum: number, q: any) => sum + (q.xp_earned || 0), 0);

		// Get daily quests
		const { data: dailyQuests, error: questsError } = await supabaseAdmin
			.from('daily_quests')
			.select('*')
			.eq('user_id', req.userId!)
			.eq('completed', false)
			.gte('expires_at', new Date().toISOString());

		if (questsError) {
			console.error('Error fetching daily quests:', questsError);
		}

		const summary = {
			profile: {
				xp: profile?.xp || 0,
				level: profile?.level || 1,
				streak: profile?.streak || 0,
				lastStudyDate: profile?.last_study_date,
			},
			statistics: {
				totalSessions,
				totalMinutes,
				totalXp,
				averageQuizScore: Math.round(averageQuizScore),
				totalAchievements: achievements?.length || 0,
			},
			weeklyStats: {
				sessions: recentSessions.length,
				minutes: weeklyMinutes,
				xp: weeklyXp,
				quizzes: recentQuizResults.length,
			},
			recentActivity: {
				sessions: recentSessions.slice(0, 5),
				quizResults: recentQuizResults.slice(0, 5),
				achievements: achievements?.slice(0, 5) || [],
			},
			dailyQuests: dailyQuests || [],
			nextLevelXp: ((profile?.level || 1) * 1000) - (profile?.xp || 0),
		};

		res.json(summary);
	} catch (error) {
		console.error('Progress summary error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get progress chart data
router.get("/chart", requireAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const days = parseInt(req.query.days as string) || 30;
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);

		// Get study sessions for the period
		const { data: sessions, error: sessionsError } = await supabaseAdmin
			.from('study_sessions')
			.select('duration_min, xp_earned, created_at')
			.eq('user_id', req.userId!)
			.gte('created_at', startDate.toISOString())
			.order('created_at', { ascending: true });

		if (sessionsError) {
			console.error('Error fetching sessions for chart:', sessionsError);
			return res.status(500).json({ error: "Failed to fetch chart data" });
		}

		// Get quiz results for the period
		const { data: quizResults, error: quizError } = await supabaseAdmin
			.from('quiz_results')
			.select('score, xp_earned, created_at')
			.eq('user_id', req.userId!)
			.gte('created_at', startDate.toISOString())
			.order('created_at', { ascending: true });

		if (quizError) {
			console.error('Error fetching quiz results for chart:', quizError);
			return res.status(500).json({ error: "Failed to fetch chart data" });
		}

		// Group data by date
		const chartData: { [key: string]: any } = {};

		// Initialize all dates with zero values
		for (let i = 0; i < days; i++) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			const dateKey = date.toISOString().split('T')[0];
			chartData[dateKey] = {
				date: dateKey,
				studyMinutes: 0,
				studyXp: 0,
				quizXp: 0,
				quizCount: 0,
				averageQuizScore: 0,
			};
		}

		// Add study session data
		sessions?.forEach(session => {
			const dateKey = session.created_at.split('T')[0];
			if (chartData[dateKey]) {
				chartData[dateKey].studyMinutes += session.duration_min || 0;
				chartData[dateKey].studyXp += session.xp_earned || 0;
			}
		});

		// Add quiz result data
		quizResults?.forEach(quiz => {
			const dateKey = quiz.created_at.split('T')[0];
			if (chartData[dateKey]) {
				chartData[dateKey].quizXp += quiz.xp_earned || 0;
				chartData[dateKey].quizCount += 1;
				chartData[dateKey].averageQuizScore = quiz.score || 0;
			}
		});

		// Convert to array and sort by date
		const chartArray = Object.values(chartData)
			.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

		res.json({ chartData: chartArray });
	} catch (error) {
		console.error('Progress chart error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get subject-wise progress
router.get("/subjects", requireAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		// Get study sessions grouped by subject
		const { data: sessions, error: sessionsError } = await supabaseAdmin
			.from('study_sessions')
			.select('subject, duration_min, xp_earned')
			.eq('user_id', req.userId!);

		if (sessionsError) {
			console.error('Error fetching sessions by subject:', sessionsError);
			return res.status(500).json({ error: "Failed to fetch subject data" });
		}

		// Get quiz results grouped by topic
		const { data: quizResults, error: quizError } = await supabaseAdmin
			.from('quiz_results')
			.select('topic, score, xp_earned')
			.eq('user_id', req.userId!);

		if (quizError) {
			console.error('Error fetching quiz results by topic:', quizError);
			return res.status(500).json({ error: "Failed to fetch subject data" });
		}

		// Group by subject
		const subjectData: { [key: string]: any } = {};

		sessions?.forEach(session => {
			const subject = session.subject;
			if (!subjectData[subject]) {
				subjectData[subject] = {
					subject,
					totalMinutes: 0,
					totalXp: 0,
					sessionCount: 0,
					averageScore: 0,
					quizCount: 0,
				};
			}
			subjectData[subject].totalMinutes += session.duration_min || 0;
			subjectData[subject].totalXp += session.xp_earned || 0;
			subjectData[subject].sessionCount += 1;
		});

		quizResults?.forEach(quiz => {
			const topic = quiz.topic;
			if (!subjectData[topic]) {
				subjectData[topic] = {
					subject: topic,
					totalMinutes: 0,
					totalXp: 0,
					sessionCount: 0,
					averageScore: 0,
					quizCount: 0,
				};
			}
			subjectData[topic].totalXp += quiz.xp_earned || 0;
			subjectData[topic].quizCount += 1;
			subjectData[topic].averageScore = quiz.score || 0;
		});

		// Calculate average scores for subjects with quizzes
		Object.keys(subjectData).forEach(subject => {
			const data = subjectData[subject];
			if (data.quizCount > 0) {
				const subjectQuizzes = quizResults?.filter(q => q.topic === subject) || [];
				const totalScore = subjectQuizzes.reduce((sum, q) => sum + (q.score || 0), 0);
				data.averageScore = Math.round(totalScore / data.quizCount);
			}
		});

		const subjectArray = Object.values(subjectData)
			.sort((a: any, b: any) => b.totalXp - a.totalXp);

		res.json({ subjects: subjectArray });
	} catch (error) {
		console.error('Subject progress error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
