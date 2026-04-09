import { useEffect, useState } from 'react'
import { api, DashboardResult, ActivityResult } from '../api/client'
import styles from './MedalsPage.module.css'

interface Props {
  userId: string
}

// ── Streak logic ───────────────────────────────────────────────────────────

function computeStreak(data: number[], threshold: number): number {
  // If today (index 29) is 0 the day may not be over — anchor from yesterday
  const startIdx = data[29] === 0 ? 28 : 29
  let count = 0
  for (let i = startIdx; i >= 0; i--) {
    if (data[i] >= threshold) count++
    else break
  }
  return count
}

// ── Medal category definitions ─────────────────────────────────────────────

interface CategoryDef {
  title: string
  description: string
  icon: string
  unit: string
  tiers: number[]
  accent: string
  current: number
}

function buildCategories(dash: DashboardResult, act: ActivityResult): CategoryDef[] {
  return [
    {
      title: 'Planting Streak',
      description: 'Plant ≥10 seeds every day in a row, ending today',
      icon: '🌱',
      unit: 'days',
      tiers: [5, 10, 15, 20, 25],
      accent: '#16a34a',
      current: computeStreak(act.created, 10),
    },
    {
      title: 'Bloom Streak',
      description: 'Bloom ≥5 flowers every day in a row, ending today',
      icon: '🌸',
      unit: 'days',
      tiers: [5, 10, 15, 20, 25],
      accent: '#db2777',
      current: computeStreak(act.mastered, 5),
    },
    {
      title: 'Garden Size',
      description: 'Total flowers bloomed in your garden',
      icon: '🌻',
      unit: 'flowers',
      tiers: [10, 100, 500, 1000, 5000],
      accent: '#d97706',
      current: dash.total_flowers,
    },
    {
      title: 'Dedicated Reviewer',
      description: 'Total reviews completed',
      icon: '💧',
      unit: 'reviews',
      tiers: [10, 100, 500, 1000, 5000],
      accent: '#0284c7',
      current: dash.total_water,
    },
    {
      title: 'Seed Collector',
      description: 'Total seeds ever planted',
      icon: '🌿',
      unit: 'seeds',
      tiers: [10, 100, 500, 1000, 5000],
      accent: '#15803d',
      current: dash.total_seeds,
    },
  ]
}

// ── MedalSlot ──────────────────────────────────────────────────────────────

interface SlotProps {
  tier: number
  unit: string
  icon: string
  earned: boolean
  isNext: boolean
  current: number
  accent: string
}

function MedalSlot({ tier, unit, icon, earned, isNext, current, accent }: SlotProps) {
  const pct = Math.min(100, Math.round((current / tier) * 100))

  if (earned) {
    return (
      <div className={`${styles.slot} ${styles.earned}`} style={{ background: accent }}>
        <span className={styles.slotIcon}>{icon}</span>
        <span className={styles.slotTier}>{tier.toLocaleString()}</span>
        <span className={styles.slotUnit}>{unit}</span>
        <span className={styles.earnedBadge}>✓ Earned</span>
      </div>
    )
  }

  if (isNext) {
    return (
      <div
        className={`${styles.slot} ${styles.next}`}
        style={{ '--accent': accent } as React.CSSProperties}
      >
        <span className={`${styles.slotIcon} ${styles.iconMuted}`}>{icon}</span>
        <span className={styles.slotTier}>{tier.toLocaleString()}</span>
        <span className={styles.slotUnit}>{unit}</span>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${pct}%`, background: accent }} />
        </div>
        <span className={styles.progressLabel}>{current.toLocaleString()} / {tier.toLocaleString()}</span>
      </div>
    )
  }

  return (
    <div className={`${styles.slot} ${styles.locked}`}>
      <span className={`${styles.slotIcon} ${styles.iconMuted}`}>{icon}</span>
      <span className={styles.slotTier}>{tier.toLocaleString()}</span>
      <span className={styles.slotUnit}>{unit}</span>
      <span className={styles.lockIcon}>🔒</span>
    </div>
  )
}

// ── MedalCategory ──────────────────────────────────────────────────────────

function MedalCategory({ category }: { category: CategoryDef }) {
  const { title, description, icon, unit, tiers, accent, current } = category
  const firstUnearned = tiers.findIndex(t => current < t)

  return (
    <div className={styles.category}>
      <div className={styles.categoryHeader}>
        <span className={styles.categoryIcon}>{icon}</span>
        <div className={styles.categoryMeta}>
          <h2 className={styles.categoryTitle}>{title}</h2>
          <p className={styles.categoryDesc}>{description}</p>
        </div>
        <span className={styles.categoryCount} style={{ color: accent }}>
          {current.toLocaleString()} {unit}
        </span>
      </div>
      <div className={styles.slots}>
        {tiers.map((tier, i) => (
          <MedalSlot
            key={tier}
            tier={tier}
            unit={unit}
            icon={icon}
            earned={current >= tier}
            isNext={i === firstUnearned}
            current={current}
            accent={accent}
          />
        ))}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function MedalsPage({ userId }: Props) {
  const [categories, setCategories] = useState<CategoryDef[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([api.getDashboard(), api.getActivity()])
      .then(([dash, act]) => setCategories(buildCategories(dash, act)))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load medals.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.greeting}>Bonjour, {userId}!</p>
          <h1 className={styles.title}>🏅 Medals & Achievements</h1>
          <p className={styles.subtitle}>Your French learning milestones and awards</p>
        </div>
      </header>

      <main className={styles.main}>
        {loading && <p className={styles.loading}>Loading your medals…</p>}
        {error && <div className={styles.error}><span>⚠</span> {error}</div>}
        {categories && categories.map(cat => (
          <MedalCategory key={cat.title} category={cat} />
        ))}
      </main>

      <footer className={styles.footer}>
        <p>🌸 « Avez-vous vraiment besoin d'une citation célèbre pour vous convaincre qu'apprendre le français est amusant ? » — Kevin, votre jardinier linguistique🌸</p>
      </footer>
    </div>
  )
}
