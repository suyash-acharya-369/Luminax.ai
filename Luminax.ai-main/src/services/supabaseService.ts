import { supabase } from '../supabase/supabaseClient'

// Auth
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password })
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  return supabase.auth.signOut()
}

// Profile examples
export async function fetchProfile(userId: string) {
  return supabase.from('profiles').select('*').eq('id', userId).single()
}

export async function updateProfile(userId: string, data: any) {
  return supabase.from('profiles').update(data).eq('id', userId)
}

// Tasks examples
export async function fetchTasks() {
  return supabase.from('tasks').select('*')
}

export async function addTask(task: { title: string; description?: string }) {
  return supabase.from('tasks').insert([task])
}

export async function deleteTask(taskId: string) {
  return supabase.from('tasks').delete().eq('id', taskId)
}