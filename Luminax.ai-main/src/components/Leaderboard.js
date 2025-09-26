import React, { useEffect, useState } from 'react'
import { fetchLeaderboard } from '../supabase/quiz'

export default function Leaderboard() {
  const [board, setBoard] = useState([])

  useEffect(() => {
    const loadLeaderboard = async () => {
      const { data } = await fetchLeaderboard()
      setBoard(data)
    }
    loadLeaderboard()
  }, [])

  return (
    <div>
      <h1>Leaderboard</h1>
      <ol>
        {board.map(user => (
          <li key={user.id}>{user.username || user.name}: {user.xp} XP</li>
        ))}
      </ol>
    </div>
  )
}
