import { useEffect, useState, useCallback } from 'react'
import { api, InspectItem } from '../api/client'
import styles from './MasteredWordsPage.module.css'
import bearImg from '../assets/bear.webp'

interface Props {
  displayName: string
}

// Give each card a stable vertical position and animation timing based on its index.
// Using irrational-number spacing to avoid visual patterns.
function buildCardStyle(index: number): React.CSSProperties {
  const frac = (index * 0.618033988) % 1  // golden-ratio sequence
  const top = 8 + frac * 72              // 8 % – 80 % from top
  const duration = 70 + (index % 7) * 3.5 // 70 s – 91 s per cycle
  // negative delay puts the card at a different point in its cycle on load
  const delay = -((index * 2.414) % duration)
  return {
    top: `${top}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
  }
}

interface WordCardProps {
  item: InspectItem
  cardStyle: React.CSSProperties
  replanted: boolean
  onReplant: (id: number) => void
}

function WordCard({ item, cardStyle: cs, replanted, onReplant }: WordCardProps) {
  return (
    <div
      className={`${styles.card} ${replanted ? styles.replanted : ''}`}
      style={cs}
      onDoubleClick={replanted ? undefined : () => onReplant(item.id)}
      title={replanted ? 'Replanted!' : 'Click to replant this word'}
    >
      {item.content}
      {replanted && <span className={styles.replantedBadge}>🌱 replanted</span>}
    </div>
  )
}

export default function MasteredWordsPage({ displayName }: Props) {
  const [items, setItems] = useState<InspectItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [replanted, setReplanted] = useState<Set<number>>(new Set())
  const [showToast, setShowToast] = useState(false)
  const [toastTimer, setToastTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    api.inspectWords()
      .then(res => setItems(res.items))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load.'))
      .finally(() => setLoading(false))
  }, [])

  // Cleanup timer on unmount
  useEffect(() => () => { if (toastTimer) clearTimeout(toastTimer) }, [toastTimer])

  const handleReplant = useCallback(async (id: number) => {
    try {
      await api.replantWord(id)
      setReplanted(prev => new Set([...prev, id]))
      setShowToast(true)
      if (toastTimer) clearTimeout(toastTimer)
      const t = setTimeout(() => setShowToast(false), 3200)
      setToastTimer(t)
    } catch {
      // silently ignore — server may already have replanted
    }
  }, [toastTimer])

  const tooFew = items !== null && items.length < 5

  return (
    <div className={styles.page}>
      {showToast && (
        <div className={styles.toast}>
          🌱 This seed is replanted — back to the soil it goes!
        </div>
      )}

      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Bonjour, {displayName}!</p>
          <h1 className={styles.heroTitle}>🌸 Bloom Parade</h1>
          <p className={styles.heroSubtitle}>Words you've mastered, drifting by — double-click any to replant it</p>
        </div>
      </header>

      {loading && <p className={styles.center}>Loading your bloom parade…</p>}
      {error && <p className={styles.center}>⚠ {error}</p>}

      {tooFew && (
        <div className={styles.tooFewScene}>
          <img src={bearImg} alt="" className={styles.sadBear} />
          <p className={styles.tooFewText}>
            Not enough mastered words yet.<br />
            Come back once you've bloomed at least 5 flowers!
          </p>
        </div>
      )}

      {items && items.length >= 5 && (
        <div className={styles.scene}>
          {items.map((item, i) => (
            <WordCard
              key={item.id}
              item={item}
              cardStyle={buildCardStyle(i)}
              replanted={replanted.has(item.id)}
              onReplant={handleReplant}
            />
          ))}

        </div>
      )}

      <footer className={styles.footer}>
        <p>🌸 « Avez-vous vraiment besoin d'une citation célèbre pour vous convaincre qu'apprendre le français est amusant ? » — Kevin, votre jardinier linguistique🌸</p>
      </footer>
    </div>
  )
}
