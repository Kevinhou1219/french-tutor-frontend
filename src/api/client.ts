const BASE_URL = import.meta.env.VITE_API_BASE_URL
const FRONTEND_URL = 'https://icy-ocean-093948e10.7.azurestaticapps.net'

export function redirectToLogin() {
  window.location.href = `${BASE_URL}/.auth/login/aad?post_login_redirect_uri=${encodeURIComponent(FRONTEND_URL)}`
}

async function post<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })

  if (res.status === 401) {
    redirectToLogin()
    return new Promise(() => {})
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

async function postVoid(path: string, body: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })

  if (res.status === 401) {
    redirectToLogin()
    return new Promise(() => {})
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${res.status} ${res.statusText}`)
  }
}

export interface MeResult {
  user_id: string
  name: string
  given_name?: string
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

export interface ActivityResult {
  created: number[]
  mastered: number[]
}

export interface ReviewResult {
  id: number
  content: string
  is_word: boolean
  is_sentence: boolean
  review_count: number
  age: number
}

export interface InspectItem {
  id: number
  content: string
  mastered_time: string
}

export interface InspectResponse {
  items: InspectItem[]
}

export const api = {
  getMe: (): Promise<MeResult> =>
    fetch(`${BASE_URL}/me`, { credentials: 'include' }).then(res => {
      if (res.status === 401) {
        redirectToLogin()
        return new Promise<MeResult>(() => {})
      }
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      return res.json() as Promise<MeResult>
    }),

  lookupWord: (word: string) =>
    post<WordResult>('/word', { word }),

  lookupSentence: (sentence: string) =>
    post<SentenceResult>('/sentence', { sentence }),

  askQuestion: (question: string) =>
    post<QAResult>('/qa', { question }),

  getDashboard: () =>
    post<DashboardResult>('/dashboard', {}),

  getActivity: () =>
    post<ActivityResult>('/activity', {}),

  reviewItem: (mode: 'random' | 'oldest') =>
    post<ReviewResult>('/review_item', { mode }),

  markItem: (id: number, status: 'done' | 'not_done') =>
    postVoid('/mark_item', { id, status }),

  inspectWords: () =>
    post<InspectResponse>('/inspect', {}),

  replantWord: (id: number) =>
    postVoid('/replant', { id }),
}
