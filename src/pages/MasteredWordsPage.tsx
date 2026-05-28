import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { api, InspectItem } from '../api/client'
import styles from './MasteredWordsPage.module.css'
import bearImg from '../assets/bear.webp'

interface Props {
  displayName: string
}

interface WordCardProps {
  item: InspectItem
  replanted: boolean
  onReplant: (id: number) => void
}

function WordCard({ item, replanted, onReplant }: WordCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${styles.card} ${replanted ? styles.replanted : ''} ${visible ? styles.visible : ''}`}
      onDoubleClick={replanted ? undefined : () => onReplant(item.id)}
      title={replanted ? 'Replanted!' : 'Double-click to replant this word'}
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

  useEffect(() => () => { if (toastTimer) clearTimeout(toastTimer) }, [toastTimer])

  const columns = useMemo<[InspectItem[], InspectItem[], InspectItem[]]>(() => {
    if (!items) return [[], [], []]
    const shuffled = [...items].sort(() => Math.random() - 0.5)
    return [
      shuffled.filter((_, i) => i % 3 === 0),
      shuffled.filter((_, i) => i % 3 === 1),
      shuffled.filter((_, i) => i % 3 === 2),
    ]
  }, [items])

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
          <p className={styles.heroSubtitle}>Words you've mastered — scroll down and double-click any to replant it</p>
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
          {columns.map((col, ci) => (
            <div key={ci} className={styles.column}>
              {col.map(item => (
                <WordCard
                  key={item.id}
                  item={item}
                  replanted={replanted.has(item.id)}
                  onReplant={handleReplant}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      <footer className={styles.footer}>
        <p>🌸 « Avez-vous vraiment besoin d'une citation célèbre pour vous convaincre qu'apprendre le français est amusant ? » — Kevin, votre jardinier linguistique🌸</p>
      </footer>
    </div>
  )
}
