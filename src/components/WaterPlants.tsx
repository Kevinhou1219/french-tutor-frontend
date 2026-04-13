import { useEffect, useState, useRef, useCallback } from 'react'
import { api, ReviewResult } from '../api/client'
import styles from './WaterPlants.module.css'
import { sounds } from '../sounds'

const REVIEW_TIMEOUT = 30
const TRANS_TIMEOUT = 3

type Phase = 'pick' | 'reviewing' | 'marking'
type TransPhase = 'idle' | 'loading' | 'showing'

export default function WaterPlants() {
  const [phase, setPhase] = useState<Phase>('pick')
  const [item, setItem] = useState<ReviewResult | null>(null)
  const [loadingMode, setLoadingMode] = useState<'random' | 'oldest' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(REVIEW_TIMEOUT)
  const countdownRef = useRef(REVIEW_TIMEOUT)
  const markedRef = useRef(false)
  const [transPhase, setTransPhase] = useState<TransPhase>('idle')
  const [transText, setTransText] = useState<string | null>(null)
  const [transCountdown, setTransCountdown] = useState(TRANS_TIMEOUT)
  const transCountdownRef = useRef(TRANS_TIMEOUT)

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

  // Reset translation state when we leave the reviewing phase
  useEffect(() => {
    if (phase !== 'reviewing') {
      setTransPhase('idle')
      setTransText(null)
    }
  }, [phase])

  // Translation countdown tick
  useEffect(() => {
    if (transPhase !== 'showing') return
    transCountdownRef.current = TRANS_TIMEOUT
    setTransCountdown(TRANS_TIMEOUT)

    const tickId = setInterval(() => {
      transCountdownRef.current -= 1
      setTransCountdown(transCountdownRef.current)
      if (transCountdownRef.current <= 0) {
        clearInterval(tickId)
        setTransPhase('idle')
        setTransText(null)
        markItem('not_done')
      }
    }, 1000)

    return () => clearInterval(tickId)
  }, [transPhase, markItem])

  const handleNeedMoreWork = useCallback(async () => {
    sounds.needWork.play()
    setTransPhase('loading')
    try {
      const result = await api.translate(item!.content)
      if (markedRef.current) {
        // 30s timer already fired; don't show stale translation
        setTransPhase('idle')
        return
      }
      setTransText(result.translation)
      setTransPhase('showing')
    } catch {
      setTransPhase('idle')
      markItem('not_done')
    }
  }, [item, markItem])

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

          {transPhase !== 'idle' && (
            <div className={styles.translationBox}>
              {transPhase === 'loading' ? (
                <span className={styles.spinner} aria-label="Translating" />
              ) : (
                <>
                  <div className={styles.translationHeader}>
                    <p className={styles.translationText}>🌱 {transText}</p>
                    <button
                      className={styles.transCloseBtn}
                      onClick={() => {
                        setTransPhase('idle')
                        setTransText(null)
                        markItem('not_done')
                      }}
                      aria-label="Dismiss"
                    >✕</button>
                  </div>
                  <div className={styles.countdownBar} style={{ width: '20%' }}>
                    <div
                      className={styles.transCountdownFill}
                      style={{ width: `${(transCountdown / TRANS_TIMEOUT) * 100}%` }}
                    />
                  </div>
                  <p className={styles.countdownText}>{transCountdown}s</p>
                </>
              )}
            </div>
          )}

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
              onClick={handleNeedMoreWork}
              disabled={phase === 'marking' || transPhase !== 'idle'}
            >
              {phase === 'marking' || transPhase === 'loading'
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
