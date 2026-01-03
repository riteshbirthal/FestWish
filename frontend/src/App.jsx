import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Festivals from './pages/Festivals'
import FestivalDetail from './pages/FestivalDetail'
import CreateWish from './pages/CreateWish'
import WishPreview from './pages/WishPreview'
import WishView from './pages/WishView'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Routes>
      {/* Public wish view - no layout, full celebration page */}
      <Route path="wish/:wishId/view" element={<WishView />} />
      
      {/* Main app with layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="festivals" element={<Festivals />} />
        <Route path="festivals/:slug" element={<FestivalDetail />} />
        <Route path="create-wish" element={<CreateWish />} />
        <Route path="wish/:wishId/preview" element={<WishPreview />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  )
}

export default App
