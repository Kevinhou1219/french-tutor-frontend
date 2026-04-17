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
          <div className={styles.sectionLabel}>
            <span className={styles.sectionTitle}>🧑‍🌾 The Diligent Gardener</span>
            <span className={styles.sectionSubtitle}>Every seed gets planted. Your garden will remember.</span>
          </div>
          <LookupCard
            title="Recherche de mot 🥐"
            subtitle="Drop in a French word to plant a seed"
            placeholder="e.g. bonjour"
            buttonLabel="AI Search"
            quickButtonLabel="Quick Search"
            accentColor="#16a34a"
            maxInputLength={30}
            onSubmit={(word) => api.lookupWord(word)}
            onSubmitQuick={(word) => api.lookupWordQuick(word)}
            renderResult={(result) => <WordResultView result={result} />}
          />
          <LookupCard
            title="Recherche de phrase 🥐"
            subtitle="Drop in a French sentence to plant a seed"
            placeholder="e.g. Comment vous appelez-vous ?"
            buttonLabel="AI Search"
            quickButtonLabel="Quick Search"
            accentColor="#0f766e"
            maxInputLength={300}
            onSubmit={(sentence) => api.lookupSentence(sentence)}
            onSubmitQuick={(sentence) => api.lookupSentenceQuick(sentence)}
            renderResult={(result) => <SentenceResultView result={result} />}
          />
          <LookupCard
            title="Word Lookup 🫖"
            subtitle="Drop in an English word to plant a French seed"
            placeholder="e.g. hello"
            buttonLabel="Quick Search"
            accentColor="#16a34a"
            maxInputLength={30}
            onSubmit={(word) => api.lookupWordEnQuick(word)}
            renderResult={(result) => <WordResultView result={result} />}
          />
          <LookupCard
            title="Sentence Lookup 🫖"
            subtitle="Drop in an English sentence to plant a French seed"
            placeholder="e.g. How are you?"
            buttonLabel="Quick Search"
            accentColor="#0f766e"
            maxInputLength={300}
            onSubmit={(sentence) => api.lookupSentenceEnQuick(sentence)}
            renderResult={(result) => <SentenceResultView result={result} />}
          />
          <div className={styles.sectionLabel}>
            <span className={styles.sectionTitle}>🍷 The Tipsy Gardener</span>
            <span className={styles.sectionSubtitle}>Brilliant conversationalist. Absolutely no recollection by morning.</span>
          </div>
          <div className={styles.fullWidth}>
            <QACard />
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>🌸 « Avez-vous vraiment besoin d'une citation célèbre pour vous convaincre qu'apprendre le français est amusant ? » — Kevin, votre jardinier linguistique🌸</p>
      </footer>
    </div>
  )
}
