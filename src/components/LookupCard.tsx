import { useState } from 'react'
import styles from './LookupCard.module.css'

interface Props<T> {
  title: string
  subtitle: string
  placeholder: string
  buttonLabel: string
  accentColor: string
  onSubmit: (value: string) => Promise<T>
  renderResult: (result: T) => React.ReactNode
}

export default function LookupCard<T>({
  title,
  subtitle,
  placeholder,
  buttonLabel,
  accentColor,
  onSubmit,
  renderResult,
}: Props<T>) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await onSubmit(trimmed)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.card} style={{ '--accent': accentColor } as React.CSSProperties}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          autoComplete="off"
        />
        <button
          className={styles.button}
          type="submit"
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <span className={styles.spinner} aria-label="Loading" />
          ) : (
            buttonLabel
          )}
        </button>
      </form>

      {error && (
        <div className={styles.error} role="alert">
          <span className={styles.errorIcon}>⚠</span>
          {error}
        </div>
      )}

      {result != null && !error && renderResult(result)}
    </div>
  )
}
