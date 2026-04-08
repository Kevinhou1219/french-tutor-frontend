import { api } from '../api/client'
import LookupCard from '../components/LookupCard'
import WordResultView from '../components/WordResultView'
import SentenceResultView from '../components/SentenceResultView'
import QACard from '../components/QACard'
import MyGarden from '../components/MyGarden'
import Activity from '../components/Activity'
import WaterPlants from '../components/WaterPlants'
import styles from '../App.module.css'

interface Props {
  userId: string
}

export default function GardenPage({ userId }: Props) {
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
          <p className={styles.greeting}>Bonjour, {userId}!</p>
          <h1 className={styles.heroTitle}>{userId}'s French Garden</h1>
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
        <MyGarden userId={userId} />
        <Activity userId={userId} />
        <WaterPlants userId={userId} />
        <div className={styles.grid}>
          <LookupCard
            title="Word Lookup 🌱"
            subtitle="Drop in a French word to plant a seed"
            placeholder="e.g. bonjour"
            buttonLabel="Look up"
            accentColor="#16a34a"
            maxInputLength={30}
            onSubmit={(word) => api.lookupWord(word, userId)}
            renderResult={(result) => <WordResultView result={result} />}
          />
          <LookupCard
            title="Sentence Lookup 🌱"
            subtitle="Drop in a French sentence to plant a seed"
            placeholder="e.g. Comment vous appelez-vous ?"
            buttonLabel="Translate"
            accentColor="#0f766e"
            maxInputLength={300}
            onSubmit={(sentence) => api.lookupSentence(sentence, userId)}
            renderResult={(result) => <SentenceResultView result={result} />}
          />
        </div>
        <QACard />
      </main>

      <footer className={styles.footer}>
        <p>🌸 « Avez-vous vraiment besoin d'une citation célèbre pour vous convaincre qu'apprendre le français est amusant ? » — Kevin, votre jardinier linguistique🌸</p>
      </footer>
    </div>
  )
}
