import type { SentenceResult } from '../api/client'
import styles from './ResultView.module.css'

interface Props {
  result: SentenceResult
}

export default function SentenceResultView({ result }: Props) {
  return (
    <div className={styles.container}>
      <Section label="Translation">
        <p className={styles.primary}>{result.translation}</p>
      </Section>

      <Section label="Tense">
        <p>{result.tense}</p>
      </Section>

      {result.grammar_points && (
        <Section label="Grammar Points">
          <p>{result.grammar_points}</p>
        </Section>
      )}

      {result.idiomatic_expressions && (
        <Section label="Idiomatic Expressions">
          <p>{result.idiomatic_expressions}</p>
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
