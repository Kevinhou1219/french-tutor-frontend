import { useState } from 'react'
import { api } from '../api/client'
import styles from './QACard.module.css'
import { sounds } from '../sounds'

export default function QACard() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleClear() {
    setQuestion('')
    setAnswer(null)
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = question.trim()
    if (!trimmed) return

    sounds.lookup.play()
    setLoading(true)
    setError(null)
    setAnswer(null)

    try {
      const data = await api.askQuestion(trimmed)
      setAnswer(data.answer)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Ask Your Gardener 🧑‍🌾</h2>
          <p className={styles.subtitle}>Ask me anything about French! Don't be shy, I won't remember any of this 🫣</p>
        </div>
        {(question.length > 0 || answer !== null || error !== null) && (
          <button className={styles.clearBtn} type="button" onClick={handleClear}>
            Clear
          </button>
        )}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea
          className={styles.textarea}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              if (!loading && question.trim()) handleSubmit(e as unknown as React.FormEvent)
            }
          }}
          placeholder="e.g. When do I use 'imparfait' vs 'passé composé'?"
          disabled={loading}
          rows={3}
        />
        <button
          className={styles.button}
          type="submit"
          disabled={loading || !question.trim()}
        >
          {loading ? (
            <span className={styles.spinner} aria-label="Loading" />
          ) : (
            'Ask'
          )}
        </button>
      </form>

      {error && (
        <div className={styles.error} role="alert">
          <span className={styles.errorIcon}>⚠</span>
          {error}
        </div>
      )}

      {answer && (
        <>
          <p className={styles.answerLabel}>Answer</p>
          <div
            className={styles.answer}
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </>
      )}
    </div>
  )
}
