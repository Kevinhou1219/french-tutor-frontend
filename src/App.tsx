import { api } from './api/client'
import LookupCard from './components/LookupCard'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.flag} aria-hidden="true">🇫🇷</div>
          <h1 className={styles.heroTitle}>Kevin's French Tutor</h1>
          <p className={styles.heroSubtitle}>
            Look up French words and sentences instantly — powered by AI.
          </p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          <LookupCard
            title="Word Lookup"
            subtitle="Enter a French word to get its meaning, usage, and examples."
            placeholder="e.g. bonjour"
            buttonLabel="Look up"
            accentColor="#2563eb"
            onSubmit={(word) => api.lookupWord(word)}
          />
          <LookupCard
            title="Sentence Lookup"
            subtitle="Enter a French sentence to get a translation and breakdown."
            placeholder="e.g. Comment vous appelez-vous ?"
            buttonLabel="Translate"
            accentColor="#4f46e5"
            onSubmit={(sentence) => api.lookupSentence(sentence)}
          />
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Built with ❤️ for learning French</p>
      </footer>
    </div>
  )
}
