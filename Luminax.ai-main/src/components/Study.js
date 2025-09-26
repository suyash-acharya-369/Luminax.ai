import React, { useEffect, useState } from 'react'
import { fetchQuizzes, submitResult } from '../supabase/quiz'

export default function Study({ userId }) {
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    const loadQuizzes = async () => {
      const { data } = await fetchQuizzes()
      setQuizzes(data)
    }
    loadQuizzes()
  }, [])

  const handleSubmit = async (quizId, score) => {
    const { error } = await submitResult(userId, quizId, score)
    if (error) alert(error.message || 'Failed to submit')
    else alert('Result submitted!')
  }

  return (
    <div>
      <h1>AI Quizzes</h1>
      {quizzes.map(q => (
        <div key={q.id}>
          <h2>{q.topic}</h2>
          <button onClick={() => handleSubmit(q.id, 10)}>Submit Sample Score</button>
        </div>
      ))}
    </div>
  )
}
