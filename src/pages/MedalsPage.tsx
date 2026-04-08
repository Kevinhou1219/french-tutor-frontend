import styles from './MedalsPage.module.css'

interface Props {
  userId: string
}

export default function MedalsPage({ userId }: Props) {
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
        <div className={styles.placeholder}>
          <span className={styles.placeholderIcon}>🚧</span>
          <p>Medals and achievements coming soon...</p>
        </div>
      </main>
    </div>
  )
}
