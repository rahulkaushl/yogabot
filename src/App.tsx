import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Yoga from './pages/Yoga'
import Chat from './pages/Chat'
import Detox from './pages/Detox'
import ScreenTime from './pages/ScreenTime'
import Profile from './pages/Profile'
import Community from './pages/Community'
import MediaLiteracy from './pages/MediaLiteracy'
import Onboarding from './pages/Onboarding'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/yoga" element={<Yoga />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/detox" element={<Detox />} />
        <Route path="/screen-time" element={<ScreenTime />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community" element={<Community />} />
        <Route path="/media-literacy" element={<MediaLiteracy />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </Layout>
  )
}
