import { useEffect, useState, useCallback, useRef } from 'react'
import { api, ActivityResult } from '../api/client'
import styles from './Activity.module.css'
import { sounds } from '../sounds'

const POLL_INTERVAL = 60

export default function Activity() {
  const [data, setData] = useState<ActivityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(POLL_INTERVAL)
  const countdownRef = useRef(POLL_INTERVAL)

  const fetchActivity = useCallback(async () => {
    setLoading(true)
    setError(null)
    countdownRef.current = POLL_INTERVAL
    setCountdown(POLL_INTERVAL)
    try {
      const result = await api.getActivity()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activity.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchActivity()
    const pollId = setInterval(fetchActivity, POLL_INTERVAL * 1000)
    return () => clearInterval(pollId)
  }, [fetchActivity])

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
          <h2 className={styles.title}>30-Day Activity</h2>
          <p className={styles.subtitle}>Seeds planted and flowers bloomed over the last 30 days</p>
        </div>
        <div className={styles.refreshGroup}>
          <span className={styles.countdown}>
            {loading ? 'Refreshing…' : `Next refresh in ${countdown}s`}
          </span>
          <button
            className={styles.refreshBtn}
            onClick={() => { sounds.refresh.play(); fetchActivity() }}
            disabled={loading}
            aria-label="Refresh activity"
          >
            <span className={`${styles.refreshIcon} ${loading ? styles.spinning : ''}`}>↻</span>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.error} role="alert">
          <span>⚠</span> {error}
        </div>
      )}

      {data && <ActivityChart created={data.created} mastered={data.mastered} />}
    </div>
  )
}

// ── Chart ────────────────────────────────────────────────────────────────────

const W = 760
const H = 200
const ML = 32  // left margin for y-axis labels
const MR = 8   // right margin
const MT = 12  // top margin
const MB = 32  // bottom margin for x-axis labels
const CHART_W = W - ML - MR
const CHART_H = H - MT - MB

const X_LABELS: { i: number; label: string }[] = [
  { i: 4,  label: '25 days ago' },
  { i: 9,  label: '20 days ago' },
  { i: 14, label: '15 days ago' },
  { i: 19, label: '10 days ago' },
  { i: 24, label: '5 days ago'  },
  { i: 29, label: 'Today'       },
]

function ActivityChart({ created, mastered }: { created: number[]; mastered: number[] }) {
  const maxVal = Math.max(1, ...created, ...mastered)
  const groupW  = CHART_W / 30
  const barW    = Math.max(3, Math.floor(groupW * 0.36))
  const gap     = 2

  // evenly-spaced y ticks: 0, 25%, 50%, 75%, 100%
  const rawTicks = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(t * maxVal))
  const ticks = [...new Set(rawTicks)]

  function toX(i: number, slot: number) {
    return ML + i * groupW + (groupW - barW * 2 - gap) / 2 + slot * (barW + gap)
  }

  function toY(val: number) {
    return MT + CHART_H - (val / maxVal) * CHART_H
  }

  function toH(val: number) {
    return (val / maxVal) * CHART_H
  }

  return (
    <div>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotGreen}`} />
          Seeds planted
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotPink}`} />
          Flowers bloomed
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.chart}
        aria-label="30-day activity bar chart"
      >
        {/* Gridlines + y-axis labels */}
        {ticks.map(tick => {
          const y = toY(tick)
          return (
            <g key={tick}>
              <line
                x1={ML} y1={y} x2={W - MR} y2={y}
                stroke="#f3f4f6" strokeWidth="1"
              />
              <text x={ML - 5} y={y + 3.5} fontSize="9" fill="#9ca3af" textAnchor="end">
                {tick}
              </text>
            </g>
          )
        })}

        {/* Bars */}
        {created.map((seedVal, i) => {
          const bloomVal = mastered[i]
          return (
            <g key={i}>
              {seedVal > 0 && (
                <rect
                  x={toX(i, 0)} y={toY(seedVal)}
                  width={barW} height={toH(seedVal)}
                  fill="#4ade80" rx="2"
                >
                  <title>Day -{29 - i}: {seedVal} seed{seedVal !== 1 ? 's' : ''} planted</title>
                </rect>
              )}
              {bloomVal > 0 && (
                <rect
                  x={toX(i, 1)} y={toY(bloomVal)}
                  width={barW} height={toH(bloomVal)}
                  fill="#f472b6" rx="2"
                >
                  <title>Day -{29 - i}: {bloomVal} flower{bloomVal !== 1 ? 's' : ''} bloomed</title>
                </rect>
              )}
            </g>
          )
        })}

        {/* X-axis baseline */}
        <line
          x1={ML} y1={MT + CHART_H} x2={W - MR} y2={MT + CHART_H}
          stroke="#e5e7eb" strokeWidth="1"
        />

        {/* X-axis labels */}
        {X_LABELS.map(({ i, label }) => (
          <text
            key={i}
            x={ML + i * groupW + groupW / 2}
            y={H - 8}
            fontSize="9"
            fill="#9ca3af"
            textAnchor="middle"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  )
}
