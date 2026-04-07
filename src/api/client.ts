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
  [key: string]: unknown
}

export interface SentenceResult {
  [key: string]: unknown
}

export const api = {
  lookupWord: (word: string) =>
    post<WordResult>('/word', { word }),

  lookupSentence: (sentence: string) =>
    post<SentenceResult>('/sentence', { sentence }),
}
