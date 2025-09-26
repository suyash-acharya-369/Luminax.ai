import { supabase } from './supabaseClient'

export async function signup(email: string, password: string) {
	const { data, error } = await supabase.auth.signUp({ email, password })
	return { data, error }
}

export async function login(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({ email, password })
	return { data, error }
}

export async function logout(): Promise<void> {
	await supabase.auth.signOut()
}


