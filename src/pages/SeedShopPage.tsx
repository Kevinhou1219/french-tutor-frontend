import { api } from '../api/client'
import LookupCard from '../components/LookupCard'
import WordResultView from '../components/WordResultView'
import SentenceResultView from '../components/SentenceResultView'
import QACard from '../components/QACard'
import styles from './SeedShopPage.module.css'

interface Props {
  displayName: string
}

export default function SeedShopPage({ displayName }: Props) {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.greeting}>Bonjour, {displayName}!</p>
          <h1 className={styles.title}>🌿 My Seed Shop</h1>
          <p className={styles.subtitle}>Look up words and sentences to plant new seeds</p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          <LookupCard
            title="Word Lookup 🌱"
            subtitle="Drop in a French word to plant a seed"
            placeholder="e.g. bonjour"
            buttonLabel="Look up"
            accentColor="#16a34a"
            maxInputLength={30}
            onSubmit={(word) => api.lookupWord(word)}
            renderResult={(result) => <WordResultView result={result} />}
          />
          <LookupCard
            title="Sentence Lookup 🌱"
            subtitle="Drop in a French sentence to plant a seed"
            placeholder="e.g. Comment vous appelez-vous ?"
            buttonLabel="Translate"
            accentColor="#0f766e"
            maxInputLength={300}
            onSubmit={(sentence) => api.lookupSentence(sentence)}
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
