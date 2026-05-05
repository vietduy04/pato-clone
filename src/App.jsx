import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CollectionsPage from './pages/CollectionsPage'
import SearchPage from './pages/SearchPage'
import ProductPage from './pages/ProductPage'
import StaticPage from './pages/StaticPage'
import BlogListPage from './pages/BlogListPage'
import BlogPostPage from './pages/BlogPostPage'
import useStore from './store'

function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname, search])
  return null
}

export default function App() {
  const load = useStore(s => s.load)
  useEffect(() => { load() }, [load])

  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:handle" element={<CollectionsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/products/:handle" element={<ProductPage />} />
          <Route path="/pages/:handle" element={<StaticPage />} />
          <Route path="/blogs" element={<BlogListPage />} />
          <Route path="/blogs/:slug" element={<BlogPostPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
