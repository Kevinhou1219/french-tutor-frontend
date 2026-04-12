import MyGarden from '../components/MyGarden'
import Activity from '../components/Activity'
import WaterPlants from '../components/WaterPlants'
import styles from '../App.module.css'

interface Props {
  displayName: string
}

export default function GardenPage({ displayName }: Props) {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span className={`${styles.deco} ${styles.decoFlower}`} aria-hidden="true">🌼</span>
        <span className={`${styles.deco} ${styles.decoBee}`} aria-hidden="true">🐝</span>
        <span className={`${styles.deco} ${styles.decoLeaf}`} aria-hidden="true">🍃</span>
        <span className={`${styles.deco} ${styles.decoWatering}`} aria-hidden="true">🪣</span>
        <div className={styles.heroInner}>
          <div className={styles.flag} aria-hidden="true">
            <div className={styles.flagBlue} />
            <div className={styles.flagWhite} />
            <div className={styles.flagRed} />
          </div>
          <p className={styles.greeting}>Bonjour, {displayName}!</p>
          <h1 className={styles.heroTitle}>{displayName}'s French Garden</h1>
          <p className={styles.heroSubtitle}>
            Every word you look up is a seed you plant 🌱 <br/>Water your plants regularly by reviewing the words.💧 <br/>Your French will flourish 🌸
          </p>
          <div className={styles.gardenScene} aria-hidden="true">
            <span>🌱</span>
            <span>🌷</span>
            <span>🧑‍🌾</span>
            <span>🌻</span>
            <span>🦋</span>
            <span>🪴</span>
            <span>🌿</span>
            <span>🌸</span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <MyGarden />
        <Activity />
        <WaterPlants />
      </main>

      <footer className={styles.footer}>
        <p>🌸 « Avez-vous vraiment besoin d'une citation célèbre pour vous convaincre qu'apprendre le français est amusant ? » — Kevin, votre jardinier linguistique🌸</p>
      </footer>
    </div>
  )
}
