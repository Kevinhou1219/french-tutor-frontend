import { useState, FormEvent } from 'react'
import styles from './SignIn.module.css'

interface SignInProps {
  onSignIn: (userId: string) => void
}

const steps = [
  {
    icon: '🌱',
    label: 'Plant Seeds',
    description: 'Every word you look up gets planted as a seed in your garden.',
  },
  {
    icon: '💧',
    label: 'Water Your Garden',
    description: 'Return to review these words to strengthen your memory.',
  },
  {
    icon: '🌸',
    label: 'Watch Them Bloom',
    description: 'Master a word and it blooms into a flower!',
  },
]

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
      {/* Floating background decorations */}
      <span className={`${styles.deco} ${styles.d1}`}>🌿</span>
      <span className={`${styles.deco} ${styles.d2}`}>🌼</span>
      <span className={`${styles.deco} ${styles.d3}`}>🐝</span>
      <span className={`${styles.deco} ${styles.d4}`}>🍃</span>
      <span className={`${styles.deco} ${styles.d5}`}>🦋</span>
      <span className={`${styles.deco} ${styles.d6}`}>🌷</span>
      <span className={`${styles.deco} ${styles.d7}`}>🌻</span>
      <span className={`${styles.deco} ${styles.d8}`}>🪴</span>

      <div className={styles.content}>
        {/* Branding */}
        <div className={styles.brand}>
          <div className={styles.flag} aria-hidden="true">
            <div className={styles.flagBlue} />
            <div className={styles.flagWhite} />
            <div className={styles.flagRed} />
          </div>
          <h1 className={styles.title}>French Garden</h1>
          <p className={styles.subtitle}>Learn French one seed at a time 🌱</p>
        </div>

        {/* How it works */}
        <div className={styles.steps}>
          {steps.map((step, i) => (
            <div
              key={step.label}
              className={styles.step}
              style={{ animationDelay: `${0.15 + i * 0.12}s` }}
            >
              <span className={styles.stepIcon}>{step.icon}</span>
              <div>
                <p className={styles.stepLabel}>{step.label}</p>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sign-in form */}
        <div className={styles.card}>
          <p className={styles.cardHeading}>Step into your garden</p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              id="userId"
              className={styles.input}
              type="text"
              placeholder="Enter your name or ID…"
              maxLength={30}
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value)
                setError('')
              }}
              autoFocus
            />
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.button} type="submit">
              Allons-y
            </button>
          </form>
        </div>

        <div className={styles.gardenScene} aria-hidden="true">
          <span>🌱</span>
          <span>🌷</span>
          <span>🧑‍🌾</span>
          <span>🌻</span>
          <span>🦋</span>
          <span>🪴</span>
          <span>🌿</span>
          <span>🌸</span>
        </div>
      </div>
    </div>
  )
}
