const BASE_URL = import.meta.env.VITE_API_BASE_URL

async function post<T>(path: string, body: Record<string, string>): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

export interface WordResult {
  translation: string
  conjugations: string[] | null
  synonyms: string[] | null
  common_phrases: string[] | null
  example_sentence: string
}

export interface SentenceResult {
  translation: string
  tense: string
  grammar_points: string | null
  idiomatic_expressions: string | null
}

export interface QAResult {
  answer: string
}

export interface DashboardResult {
  word_seeds: number
  sentence_seeds: number
  total_seeds: number
  word_water: number
  sentence_water: number
  total_water: number
  word_flowers: number
  sentence_flowers: number
  total_flowers: number
  oldest_seed_days: number | null
}

export const api = {
  lookupWord: (word: string, userId: string) =>
    post<WordResult>('/word', { word, user_id: userId }),

  lookupSentence: (sentence: string, userId: string) =>
    post<SentenceResult>('/sentence', { sentence, user_id: userId }),

  askQuestion: (question: string) =>
    post<QAResult>('/qa', { question }),

  getDashboard: (userId: string) =>
    post<DashboardResult>('/dashboard', { user_id: userId }),
}
