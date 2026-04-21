import { useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import posthog from 'posthog-js'
import RestaurantCard from '../components/RestaurantCard'
import useStore from '../store'
import './SearchPage.css'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const { restaurants, loaded } = useStore()

  const results = useMemo(() => {
    if (!q.trim()) return restaurants
    const lower = q.toLowerCase()
    return restaurants.filter(r =>
      r.title.toLowerCase().includes(lower) ||
      r.address.toLowerCase().includes(lower) ||
      r.cuisine_all?.some(c => c.toLowerCase().includes(lower))
    )
  }, [q, restaurants])

  useEffect(() => {
    if (!loaded || !q.trim()) return
    posthog.capture('search', { query: q, result_count: results.length })
  }, [q, loaded, results.length])

  return (
    <div className="search-page">
      <div className="wrapper">
        <div className="inner">
          <h1 className="search-h1">
            {q ? `Kết quả tìm kiếm: "${q}"` : 'Tất cả nhà hàng'}
          </h1>
          <p className="search-count">
            {!loaded ? 'Đang tải...' : `${results.length} kết quả`}
          </p>
          <div className="search-grid">
            {results.map(r => (
              <RestaurantCard key={r.handle} restaurant={r} />
            ))}
          </div>
          {loaded && results.length === 0 && (
            <div className="no-results">
              <p>Không tìm thấy nhà hàng phù hợp với "{q}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
