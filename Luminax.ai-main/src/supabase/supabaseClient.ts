import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://dykxarjanhjdslnknvrt.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5a3hhcmphbmhqZHNsbmtudnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4OTUyNDMsImV4cCI6MjA3NDQ3MTI0M30.N4nkiV9izX-Z0rsB1tbP3ahHSitkSlm6u-LuYQOEtIA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)