import type { WordResult } from '../api/client'
import { Md } from './md'
import styles from './ResultView.module.css'

interface Props {
  result: WordResult
}

export default function WordResultView({ result }: Props) {
  return (
    <div className={styles.container}>
      <Section label="Translation">
        <p className={styles.primary}><Md text={result.translation ?? ''} /></p>
      </Section>

      <Section label="Example">
        <p className={styles.italic}><Md text={result.example_sentence ?? ''} /></p>
      </Section>

      {result.conjugations && (
        <Section label="Conjugations">
          <ul className={styles.list}>
            {result.conjugations.map((c, i) => <li key={i}><Md text={c} /></li>)}
          </ul>
        </Section>
      )}

      {result.synonyms && (
        <Section label="Synonyms">
          <div className={styles.chips}>
            {result.synonyms.map((s, i) => <span key={i} className={styles.chip}><Md text={s} /></span>)}
          </div>
        </Section>
      )}

      {result.common_phrases && (
        <Section label="Common Phrases">
          <ul className={styles.list}>
            {result.common_phrases.map((p, i) => <li key={i}><Md text={p} /></li>)}
          </ul>
        </Section>
      )}
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <h4 className={styles.sectionLabel}>{label}</h4>
      {children}
    </div>
  )
}
