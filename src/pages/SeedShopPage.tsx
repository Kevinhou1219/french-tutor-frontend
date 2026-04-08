import { api } from '../api/client'
import LookupCard from '../components/LookupCard'
import WordResultView from '../components/WordResultView'
import SentenceResultView from '../components/SentenceResultView'
import QACard from '../components/QACard'
import styles from './SeedShopPage.module.css'

interface Props {
  userId: string
}

export default function SeedShopPage({ userId }: Props) {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.greeting}>Bonjour, {userId}!</p>
          <h1 className={styles.title}>🌿 My Seed Shop</h1>
          <p className={styles.subtitle}>Look up words and sentences to plant new seeds, or ask your gardener anything</p>
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
    </div>
  )
}
