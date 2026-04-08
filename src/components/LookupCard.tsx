import { useState } from 'react'
import styles from './LookupCard.module.css'

interface Props<T> {
  title: string
  subtitle: string
  placeholder: string
  buttonLabel: string
  accentColor: string
  maxInputLength: number
  onSubmit: (value: string) => Promise<T>
  renderResult: (result: T) => React.ReactNode
}

export default function LookupCard<T>({
  title,
  subtitle,
  placeholder,
  buttonLabel,
  accentColor,
  maxInputLength,
  onSubmit,
  renderResult,
}: Props<T>) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleClear() {
    setInput('')
    setResult(null)
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    if (trimmed.length > maxInputLength) {
      setError(`Input must be ${maxInputLength} characters or fewer.`)
      return
    }

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
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        {(input.length > 0 || result !== null || error !== null) && (
          <button className={styles.clearBtn} type="button" onClick={handleClear}>
            Clear
          </button>
        )}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {input.length > 0 && (
          <p className={`${styles.charCount} ${input.length > maxInputLength ? styles.charCountOver : ''}`}>
            {input.length} / {maxInputLength}
          </p>
        )}
        <div className={styles.formRow}>
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
            disabled={loading || !input.trim() || input.length > maxInputLength}
          >
            {loading ? (
              <span className={styles.spinner} aria-label="Loading" />
            ) : (
              buttonLabel
            )}
          </button>
        </div>
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
