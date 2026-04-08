import { useEffect, useState, useCallback, useRef } from 'react'
import { api, DashboardResult } from '../api/client'
import styles from './MyGarden.module.css'

const POLL_INTERVAL = 60

interface Props {
  userId: string
}

export default function MyGarden({ userId }: Props) {
  const [data, setData] = useState<DashboardResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(POLL_INTERVAL)
  const countdownRef = useRef(POLL_INTERVAL)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    countdownRef.current = POLL_INTERVAL
    setCountdown(POLL_INTERVAL)
    try {
      const result = await api.getDashboard(userId)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load garden stats.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Poll every POLL_INTERVAL seconds
  useEffect(() => {
    fetchDashboard()
    const pollId = setInterval(fetchDashboard, POLL_INTERVAL * 1000)
    return () => clearInterval(pollId)
  }, [fetchDashboard])

  // Countdown ticker
  useEffect(() => {
    const tickId = setInterval(() => {
      countdownRef.current = Math.max(0, countdownRef.current - 1)
      setCountdown(countdownRef.current)
    }, 1000)
    return () => clearInterval(tickId)
  }, [])

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>My Garden</h2>
          <p className={styles.subtitle}>A snapshot of your French learning progress</p>
        </div>
        <div className={styles.refreshGroup}>
          <span className={styles.countdown}>
            {loading ? 'Refreshing…' : `Next automatic refresh in ${countdown}s`}
          </span>
          <button
            className={styles.refreshBtn}
            onClick={fetchDashboard}
            disabled={loading}
            aria-label="Refresh garden stats"
          >
            <span className={`${styles.refreshIcon} ${loading ? styles.spinning : ''}`}>↻</span>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.error} role="alert">
          <span className={styles.errorIcon}>⚠</span>
          {error}
        </div>
      )}

      {data && (
        <>
          <div className={styles.statsGrid}>
            <StatGroup
              icon="🌱"
              label="Seeds"
              description="Items you're still learning"
              total={data.total_seeds}
              word={data.word_seeds}
              sentence={data.sentence_seeds}
              accentClass={styles.accentGreen}
            />
            <StatGroup
              icon="💧"
              label="Water"
              description="Total reviews completed"
              total={data.total_water}
              word={data.word_water}
              sentence={data.sentence_water}
              accentClass={styles.accentBlue}
            />
            <StatGroup
              icon="🌸"
              label="Flowers"
              description="Items you've mastered"
              total={data.total_flowers}
              word={data.word_flowers}
              sentence={data.sentence_flowers}
              accentClass={styles.accentPink}
            />
          </div>

          {data.oldest_seed_days != null && (
            <div className={styles.oldestSeed}>
              <span className={styles.oldestIcon}>⏳</span>
              <span>
                Your oldest seed has been waiting to bloom for {' '}
                <strong>{data.oldest_seed_days}</strong>{' '}
                {data.oldest_seed_days === 1 ? 'day' : 'days'}
              </span>
            </div>
          )}
        </>
      )}

      {!data && !error && !loading && null}
    </div>
  )
}

interface StatGroupProps {
  icon: string
  label: string
  description: string
  total: number
  word: number
  sentence: number
  accentClass: string
}

function StatGroup({ icon, label, description, total, word, sentence, accentClass }: StatGroupProps) {
  return (
    <div className={`${styles.statGroup} ${accentClass}`}>
      <div className={styles.statGroupHeader}>
        <span className={styles.statIcon}>{icon}</span>
        <div>
          <p className={styles.statLabel}>{label}</p>
          <p className={styles.statDescription}>{description}</p>
        </div>
      </div>
      <p className={styles.statTotal}>{total.toLocaleString()}</p>
      <div className={styles.statBreakdown}>
        <span className={styles.breakdownItem}>
          <span className={styles.breakdownDot} />
          Words: <strong>{word.toLocaleString()}</strong>
        </span>
        <span className={styles.breakdownItem}>
          <span className={styles.breakdownDot} />
          Sentences: <strong>{sentence.toLocaleString()}</strong>
        </span>
      </div>
    </div>
  )
}
