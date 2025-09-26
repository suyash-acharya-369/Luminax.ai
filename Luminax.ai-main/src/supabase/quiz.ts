import { supabase } from './supabaseClient'

const apiBase: string = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000'

export type QuizItem = { id: number; topic: string }

export async function fetchQuizzes(topic: string = 'General', numQuestions: number = 5): Promise<{ data: QuizItem[]; error: any }> {
	try {
		const res = await fetch(`${apiBase}/ai/quiz`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ topic, numQuestions })
		})
		if (!res.ok) throw new Error('Failed to load quizzes')
		const json = await res.json()
		const data: QuizItem[] = (json.quiz?.questions || []).map((q: any, i: number) => ({ id: q.id ?? i + 1, topic }))
		return { data, error: null }
	} catch (error) {
		return { data: [], error }
	}
}

export async function submitResult(userId: string, quizId: number, score: number): Promise<{ data: any; error: any }> {
	try {
		// Submit quiz result to backend
		const res = await fetch(`${apiBase}/users/me/quiz-results`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${await getAuthToken()}`
			},
			body: JSON.stringify({
				quizId: quizId.toString(),
				topic: 'AI Quiz',
				score,
				totalQuestions: 5,
				xpEarned: Math.floor(score / 10) * 10
			})
		})
		
		if (!res.ok) throw new Error('Failed to submit quiz result')
		const result = await res.json()
		
		// Also create a study session for XP
		const { error } = await supabase
			.from('study_sessions')
			.insert({ 
				user_id: userId, 
				subject: 'AI Quiz', 
				duration_min: 5, 
				notes: `quiz:${quizId}`, 
				xp_earned: Math.floor(score / 10) * 10 
			})
		
		if (error) return { data: null, error }
		
		// Increment XP
		await supabase.rpc('increment_xp', { p_user_id: userId, p_amount: Math.floor(score / 10) * 10 })
		
		return { data: result, error: null }
	} catch (error) {
		return { data: null, error }
	}
}

export type LeaderboardUser = { id: string; username: string | null; xp: number }

export async function fetchLeaderboard(): Promise<{ data: LeaderboardUser[]; error: any }> {
	try {
		const res = await fetch(`${apiBase}/leaderboard/top`)
		if (!res.ok) throw new Error('Failed to load leaderboard')
		const json = await res.json()
		const data: LeaderboardUser[] = (json.leaderboard || []).map((user: any) => ({
			id: user.id,
			username: user.username,
			xp: user.xp || 0
		}))
		return { data, error: null }
	} catch (error) {
		return { data: [], error }
	}
}

// Helper function to get auth token
async function getAuthToken(): Promise<string> {
	const { data: { session } } = await supabase.auth.getSession()
	return session?.access_token || ''
}

// New functions for enhanced features
export async function createStudySession(subject: string, durationMin: number, notes?: string): Promise<{ data: any; error: any }> {
	try {
		const res = await fetch(`${apiBase}/study/sessions`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${await getAuthToken()}`
			},
			body: JSON.stringify({ subject, durationMin, notes })
		})
		
		if (!res.ok) throw new Error('Failed to create study session')
		const result = await res.json()
		return { data: result, error: null }
	} catch (error) {
		return { data: null, error }
	}
}

export async function fetchStudyStats(): Promise<{ data: any; error: any }> {
	try {
		const res = await fetch(`${apiBase}/study/stats`, {
			headers: { 'Authorization': `Bearer ${await getAuthToken()}` }
		})
		
		if (!res.ok) throw new Error('Failed to load study stats')
		const result = await res.json()
		return { data: result, error: null }
	} catch (error) {
		return { data: null, error }
	}
}

export async function fetchProgressSummary(): Promise<{ data: any; error: any }> {
	try {
		const res = await fetch(`${apiBase}/progress/summary`, {
			headers: { 'Authorization': `Bearer ${await getAuthToken()}` }
		})
		
		if (!res.ok) throw new Error('Failed to load progress summary')
		const result = await res.json()
		return { data: result, error: null }
	} catch (error) {
		return { data: null, error }
	}
}

export async function fetchCommunityPosts(): Promise<{ data: any; error: any }> {
	try {
		const res = await fetch(`${apiBase}/community/posts`)
		if (!res.ok) throw new Error('Failed to load community posts')
		const result = await res.json()
		return { data: result.posts || [], error: null }
	} catch (error) {
		return { data: [], error }
	}
}

export async function createCommunityPost(content: string): Promise<{ data: any; error: any }> {
	try {
		const res = await fetch(`${apiBase}/community/posts`, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${await getAuthToken()}`
			},
			body: JSON.stringify({ content })
		})
		
		if (!res.ok) throw new Error('Failed to create community post')
		const result = await res.json()
		return { data: result, error: null }
	} catch (error) {
		return { data: null, error }
	}
}


