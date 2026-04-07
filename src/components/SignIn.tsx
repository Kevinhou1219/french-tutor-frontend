import { useState, FormEvent } from 'react'
import styles from './SignIn.module.css'

interface SignInProps {
  onSignIn: (userId: string) => void
}

export default function SignIn({ onSignIn }: SignInProps) {
  const [userId, setUserId] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = userId.trim()
    if (!trimmed) {
      setError('Please enter a user ID.')
      return
    }
    if (trimmed.length > 30) {
      setError('User ID must be 30 characters or fewer.')
      return
    }
    onSignIn(trimmed)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.flag} aria-hidden="true">🇫🇷</div>
        <h1 className={styles.heading}>Kev's French Tutor</h1>
        <p className={styles.sub}>Enter your user ID to get started.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="userId">User ID</label>
          <input
            id="userId"
            className={styles.input}
            type="text"
            placeholder="e.g. kevin"
            maxLength={30}
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value)
              setError('')
            }}
            autoFocus
          />
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.button} type="submit">Sign In</button>
        </form>
      </div>
    </div>
  )
}
