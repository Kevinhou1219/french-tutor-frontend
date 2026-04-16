import { useState } from 'react'
import styles from './LookupCard.module.css'
import { sounds } from '../sounds'

interface Props<T> {
  title: string
  subtitle: string
  placeholder: string
  buttonLabel: string
  quickButtonLabel?: string
  accentColor: string
  maxInputLength: number
  onSubmit: (value: string) => Promise<T>
  onSubmitQuick?: (value: string) => Promise<T>
  renderResult: (result: T) => React.ReactNode
}

export default function LookupCard<T>({
  title,
  subtitle,
  placeholder,
  buttonLabel,
  quickButtonLabel,
  accentColor,
  maxInputLength,
  onSubmit,
  onSubmitQuick,
  renderResult,
}: Props<T>) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<T | null>(null)
  const [loadingMode, setLoadingMode] = useState<'ai' | 'quick' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loading = loadingMode !== null

  function handleClear() {
    setInput('')
    setResult(null)
    setError(null)
  }

  async function runSubmit(submitFn: (value: string) => Promise<T>, mode: 'ai' | 'quick') {
    const trimmed = input.trim()
    if (!trimmed) return
    if (trimmed.length > maxInputLength) {
      setError(`Input must be ${maxInputLength} characters or fewer.`)
      return
    }

    sounds.lookup.play()
    setLoadingMode(mode)
    setError(null)
    setResult(null)

    try {
      const data = await submitFn(trimmed)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoadingMode(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (onSubmitQuick) {
      await runSubmit(onSubmitQuick, 'quick')
    } else {
      await runSubmit(onSubmit, 'ai')
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
          {onSubmitQuick && quickButtonLabel && (
            <button
              className={styles.buttonOutline}
              type="button"
              onClick={() => runSubmit(onSubmitQuick, 'quick')}
              disabled={loading || !input.trim() || input.length > maxInputLength}
            >
              {loadingMode === 'quick' ? (
                <span className={styles.spinnerDark} aria-label="Loading" />
              ) : (
                quickButtonLabel
              )}
            </button>
          )}
          <button
            className={styles.button}
            type="submit"
            disabled={loading || !input.trim() || input.length > maxInputLength}
          >
            {loadingMode === 'ai' ? (
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
