import { useState } from 'react'
import { api } from './api/client'
import LookupCard from './components/LookupCard'
import WordResultView from './components/WordResultView'
import SentenceResultView from './components/SentenceResultView'
import SignIn from './components/SignIn'
import styles from './App.module.css'

export default function App() {
  const [userId, setUserId] = useState<string | null>(
    () => sessionStorage.getItem('userId')
  )

  function handleSignIn(id: string) {
    sessionStorage.setItem('userId', id)
    setUserId(id)
  }

  if (!userId) {
    return <SignIn onSignIn={handleSignIn} />
  }

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.flag} aria-hidden="true">🇫🇷</div>
          <p className={styles.greeting}>Bonjour, {userId}!</p>
          <h1 className={styles.heroTitle}>Kev's French Tutor</h1>
          <p className={styles.heroSubtitle}>
            No, I am not a dictionary...<br />I can explain things to provide a smooth learning experience. Think of me as your reading companion?
          </p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          <LookupCard
            title="Word Lookup"
            subtitle="Enter a word in French"
            placeholder="e.g. bonjour"
            buttonLabel="Look up"
            accentColor="#2563eb"
            onSubmit={(word) => api.lookupWord(word, userId)}
            renderResult={(result) => <WordResultView result={result} />}
          />
          <LookupCard
            title="Sentence Lookup"
            subtitle="Enter a sentence in French"
            placeholder="e.g. Comment vous appelez-vous ?"
            buttonLabel="Translate"
            accentColor="#4f46e5"
            onSubmit={(sentence) => api.lookupSentence(sentence, userId)}
            renderResult={(result) => <SentenceResultView result={result} />}
          />
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Hey, I'm your AI French tutor who's always on call. What is your excuse to procrastinate now?</p>
      </footer>
    </div>
  )
}
