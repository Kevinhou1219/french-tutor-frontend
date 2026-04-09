import { useEffect, useState, useRef, useCallback } from 'react'
import { api, ReviewResult } from '../api/client'
import styles from './WaterPlants.module.css'
import { sounds } from '../sounds'

const REVIEW_TIMEOUT = 30

type Phase = 'pick' | 'reviewing' | 'marking'

export default function WaterPlants() {
  const [phase, setPhase] = useState<Phase>('pick')
  const [item, setItem] = useState<ReviewResult | null>(null)
  const [loadingMode, setLoadingMode] = useState<'random' | 'oldest' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(REVIEW_TIMEOUT)
  const countdownRef = useRef(REVIEW_TIMEOUT)
  const markedRef = useRef(false)

  const markItem = useCallback(async (status: 'done' | 'not_done') => {
    if (markedRef.current || !item) return
    markedRef.current = true
    setPhase('marking')
    try {
      await api.markItem(item.id, status)
      sessionStorage.setItem('lastReviewedId', String(item.id))
    } catch {
      // best-effort; return to pick regardless
    }
    setItem(null)
    setPhase('pick')
    setError(null)
  }, [item])

  // Auto-dismiss the "no seeds" empty state after 5 seconds
  useEffect(() => {
    if (error !== '__empty__') return
    const id = setTimeout(() => setError(null), 5000)
    return () => clearTimeout(id)
  }, [error])

  // Countdown tick while reviewing
  useEffect(() => {
    if (phase !== 'reviewing') return
    countdownRef.current = REVIEW_TIMEOUT
    markedRef.current = false
    setCountdown(REVIEW_TIMEOUT)

    const tickId = setInterval(() => {
      countdownRef.current -= 1
      setCountdown(countdownRef.current)
      if (countdownRef.current <= 0) {
        clearInterval(tickId)
        markItem('not_done')
      }
    }, 1000)

    return () => clearInterval(tickId)
  }, [phase, markItem])

  async function startReview(mode: 'random' | 'oldest') {
    setLoadingMode(mode)
    setError(null)
    try {
      const result = await api.reviewItem(mode)
      setItem(result)
      setPhase('reviewing')
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.toLowerCase().includes('no unmastered items')) {
        setError('__empty__')
      } else {
        setError(msg || 'Could not load an item to review.')
      }
    } finally {
      setLoadingMode(null)
    }
  }

  const progressPct = (countdown / REVIEW_TIMEOUT) * 100

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Water Your Plants 💧</h2>
        <p className={styles.subtitle}>Review items to keep your garden growing</p>
      </div>

      {error === '__empty__' && (
        <div className={styles.emptyState}>
          <span>🌸</span>
          <p>No seeds left to water — your garden is fully bloomed! Keep learning to plant more seeds...</p>
        </div>
      )}

      {error && error !== '__empty__' && (
        <div className={styles.error} role="alert">
          <span className={styles.errorIcon}>⚠</span>
          {error}
        </div>
      )}

      {phase === 'pick' && (
        <div className={styles.pickRow}>
          <button
            className={`${styles.pickBtn} ${styles.pickRandom}`}
            onClick={() => { sounds.click.play(); startReview('random') }}
            disabled={loadingMode !== null}
          >
            {loadingMode === 'random'
              ? <span className={styles.spinner} aria-label="Loading" />
              : '🎲 Water a Random Seed'}
          </button>
          <button
            className={`${styles.pickBtn} ${styles.pickOldest}`}
            onClick={() => { sounds.click.play(); startReview('oldest') }}
            disabled={loadingMode !== null}
          >
            {loadingMode === 'oldest'
              ? <span className={styles.spinner} aria-label="Loading" />
              : '⏳ Water the Oldest Seed'}
          </button>
        </div>
      )}

      {(phase === 'reviewing' || phase === 'marking') && item && (
        <div className={styles.reviewArea}>
          <div className={styles.itemMeta}>
            <span className={styles.typeBadge}>
              {item.is_word ? '🌱 Word' : '🌿 Sentence'}
            </span>
            <span className={styles.metaChip}>Watering #{item.review_count}</span>
            <span className={styles.metaChip}>{item.age} {item.age === 1 ? 'day' : 'days'} in soil</span>
          </div>

          <div className={styles.content}>{item.content}</div>

          <div className={styles.actions}>
            <button
              className={`${styles.actionBtn} ${styles.masteredBtn}`}
              onClick={() => { sounds.mastered.play(); markItem('done') }}
              disabled={phase === 'marking'}
            >
              {phase === 'marking'
                ? <span className={styles.spinner} aria-label="Loading" />
                : '🌸 Mastered'}
            </button>
            <button
              className={`${styles.actionBtn} ${styles.needMoreBtn}`}
              onClick={() => { sounds.needWork.play(); markItem('not_done') }}
              disabled={phase === 'marking'}
            >
              {phase === 'marking'
                ? <span className={styles.spinner} aria-label="Loading" />
                : '💧 Need More Work'}
            </button>
          </div>

          {phase === 'reviewing' && (
            <div className={styles.countdownArea}>
              <div className={styles.countdownBar}>
                <div
                  className={styles.countdownFill}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className={styles.countdownText}>
                Auto-marking as "Need More Work" in {countdown}s
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
