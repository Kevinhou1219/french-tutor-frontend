import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { api, redirectToLogin } from './api/client'
import NavBar from './components/NavBar'
import GardenPage from './pages/GardenPage'
import SeedShopPage from './pages/SeedShopPage'
import MedalsPage from './pages/MedalsPage'
import MasteredWordsPage from './pages/MasteredWordsPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  const [userName, setUserName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getMe()
      .then(me => setUserName(me.name || me.user_id))
      .catch(() => redirectToLogin())
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null
  if (!userName) return null

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<GardenPage userId={userName} />} />
        <Route path="/seed-shop" element={<SeedShopPage userId={userName} />} />
        <Route path="/medals" element={<MedalsPage userId={userName} />} />
        <Route path="/bloom-parade" element={<MasteredWordsPage userId={userName} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
