import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './components/SignIn'
import NavBar from './components/NavBar'
import GardenPage from './pages/GardenPage'
import SeedShopPage from './pages/SeedShopPage'
import MedalsPage from './pages/MedalsPage'
import MasteredWordsPage from './pages/MasteredWordsPage'
import AboutPage from './pages/AboutPage'

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
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<GardenPage userId={userId} />} />
        <Route path="/seed-shop" element={<SeedShopPage userId={userId} />} />
        <Route path="/medals" element={<MedalsPage userId={userId} />} />
        <Route path="/bloom-parade" element={<MasteredWordsPage userId={userId} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
