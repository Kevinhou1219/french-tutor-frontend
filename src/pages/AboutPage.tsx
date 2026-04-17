import { useState } from 'react'
import { api } from '../api/client'
import styles from './AboutPage.module.css'

interface Props {
  displayName: string | null
  onNameChange: (name: string) => void
}

interface Section {
  icon: string
  title: string
  body: string[]
}

const sections: Section[] = [
  {
    icon: '📖',
    title: 'Your Reading Companion',
    body: [
      "I was born out of a simple frustration: you're deep in a French book, fully in the flow, and then... an unfamiliar word. You reach for a translator app, lose your momentum, and suddenly the magic is gone.",
      "That's why I exist. I sit quietly beside you while you read, ready to look up any word or sentence the moment you need it, so you can stay in the story.",
    ],
  },
  {
    icon: '🌱',
    title: 'Looking Up a Word — Planting a Seed',
    body: [
      "Every word you look up in the Seed Shop is a seed you drop into the soil. I give you the translation, example sentences, common phrases, conjugations, and everything else you need to understand the word, not just recognise it on the page.",
      "Seeds don't bloom overnight, and neither does vocabulary. But every single lookup is an act of curiosity, and curiosity is how gardens grow. Don't be afraid to plant a lot!",
    ],
  },
  {
    icon: '💧',
    title: 'Reviewing a Word — Watering Your Plant',
    body: [
      "A seed left unwatered withers. That's just nature. So in My Garden, I surface the words you've planted and ask you to revisit them. Each review is a cup of water. It strengthens the root, deepens the memory, and moves the plant one step closer to blooming.",
      "I'll keep bringing back the words that need attention. All you have to do is show up and water.",
    ],
  },
  {
    icon: '🌸',
    title: 'Mastering a Word — A Flower in Full Bloom',
    body: [
      "When you've reviewed a word enough times that it truly feels like yours, your flower has bloomed! Mastered words leave the review pool and take their place as blossoms in your garden.",
      "This is the moment I love the most. A bloom means you've genuinely absorbed something new into your French. Your garden becomes more beautiful with every word you master.",
    ],
  },
  {
    icon: '💐',
    title: 'The Bloom Parade — Revisiting Your Flowers',
    body: [
      "Just because a flower has bloomed doesn't mean it can never fade. Language is a living thing. If you don't visit your blooms occasionally, they can quietly slip away.",
      "The Bloom Parade is your gallery of mastered words, drifting gently across the screen. If you spot one that has grown a little fuzzy, double-click it to replant it. It heads back into your garden for another round of watering. No shame... Even the best gardeners replant.",
    ],
  },
  {
    icon: '🏅',
    title: 'Medals — Milestones Worth Celebrating',
    body: [
      "Gardening is a long game, and I believe every milestone deserves recognition. Your Trophy Shelf tracks your learning streaks and other achievements. Earn medals as you reach new heights.",
      "These aren't just badges. They're proof of the hours you've spent, the pages you've read, and the French you've quietly, steadily made your own. Wear them with pride.",
    ],
  },
  {
    icon: '❓',
    title: 'Ask Me Anything — Beyond Words and Sentences',
    body: [
      "Word lookups and sentence translations cover a lot of ground, but sometimes your curiosity goes further. Why does French use the subjunctive here? What's the cultural weight behind this expression? Is this construction formal or colloquial? These questions don't fit into a dictionary.",
      "I am at the Seed Shop's Q&A corner for exactly that. Ask me anything that's on your mind as you read, and I'll do my best to give you a real, thoughtful answer. No question is too obscure, too grammatical, or too strange. I'm here to keep your curiosity fully fed and your reading momentum intact.",
    ],
  },
]

export default function AboutPage({ displayName, onNameChange }: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleOpen() {
    setDraft(displayName ?? '')
    setError(null)
    setOpen(true)
  }

  async function handleSave() {
    const trimmed = draft.trim()
    if (!trimmed) return
    setSaving(true)
    setError(null)
    try {
      await api.updateDisplayName(trimmed)
      onNameChange(trimmed)
      setOpen(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Try again?')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Your gardener speaks</p>
          <h1 className={styles.title}>🧑‍🌾 About This Garden</h1>
          <p className={styles.subtitle}>How this little corner of the internet helps your French grow</p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.nameBarWrap}>
          {!open ? (
            <button className={styles.nameBarBtn} onClick={handleOpen}>
              🚜 Change your name
            </button>
          ) : (
            <div className={styles.nameCard}>
              <span className={styles.nameCardIcon}>🌾</span>
              <label className={styles.nameCardLabel}>What should we call you around the farm?</label>
              <input
                className={styles.nameInput}
                type="text"
                maxLength={25}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                autoFocus
              />
              <span className={styles.nameCharCount}>{draft.length}/25</span>
              {error && <span className={styles.nameError}>{error}</span>}
              <div className={styles.nameCardActions}>
                <button className={styles.nameSaveBtn} onClick={handleSave} disabled={saving || !draft.trim()}>
                  {saving ? 'Saving…' : 'Looks good 🌱'}
                </button>
                <button className={styles.nameCancelBtn} onClick={() => setOpen(false)}>
                  Never mind
                </button>
              </div>
            </div>
          )}
        </div>
        {sections.map(section => (
          <div key={section.title} className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span>{section.icon}</span> {section.title}
            </h2>
            {section.body.map((paragraph, i) => (
              <p key={i} className={styles.sectionBody}>{paragraph}</p>
            ))}
          </div>
        ))}

        <div className={styles.closing}>
          <p className={styles.closingText}>
            I am genuinely, deeply excited to tend this garden alongside you. Every word you look up, every review you do, every bloom you earn — I see it all, and I'm rooting for you (pun very much intended).
          </p>
          <p className={styles.closingFrench}>
            À votre jardin, et bonne lecture. 🌿
          </p>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>🌸 « Avez-vous vraiment besoin d'une citation célèbre pour vous convaincre qu'apprendre le français est amusant ? » — Kevin, votre jardinier linguistique🌸</p>
      </footer>
    </div>
  )
}
