import { login } from '../supabase/auth'

const handleLogin = async () => {
  const { data, error } = await login(email, password)
  if (error) alert(error.message)
  else console.log('Logged in:', data.user)
}
