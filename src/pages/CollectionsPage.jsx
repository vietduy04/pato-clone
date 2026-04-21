import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import posthog from 'posthog-js'
import RestaurantCard from '../components/RestaurantCard'
import useStore from '../store'
import config from '../data/config.json'
import './CollectionsPage.css'

export default function CollectionsPage() {
  const { restaurants, loaded } = useStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [cuisine, setCuisine] = useState(searchParams.get('cuisine') || '')
  const [service, setService] = useState(searchParams.get('service') || '')
  const [price, setPrice] = useState(searchParams.get('price') || '')

  function applyFilter(key, val) {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val)
    else p.delete(key)
    setSearchParams(p)
    if (key === 'cuisine') setCuisine(val)
    if (key === 'service') setService(val)
    if (key === 'price') setPrice(val)
    if (val) posthog.capture('filter_applied', { filter_type: key, value: val })
  }

  const filtered = useMemo(() => {
    return restaurants.filter(r => {
      if (cuisine && !r.cuisine_all?.includes(cuisine)) return false
      if (service && r.service_type !== service) return false
      if (price && r.price_range !== price) return false
      return true
    })
  }, [restaurants, cuisine, service, price])

  return (
    <div className="collections-page">
      <div className="wrapper">
        <div className="collections-inner">
          <aside className="collections-sidebar">
            <div className="filter-section">
              <h3>Loại hình ẩm thực</h3>
              <ul>
                <li className={!cuisine ? 'active' : ''}>
                  <button onClick={() => applyFilter('cuisine', '')}>Tất cả</button>
                </li>
                {config.cuisine_main.map(c => (
                  <li key={c} className={cuisine === c ? 'active' : ''}>
                    <button onClick={() => applyFilter('cuisine', c)}>{c}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="filter-section">
              <h3>Loại dịch vụ</h3>
              <ul>
                <li className={!service ? 'active' : ''}>
                  <button onClick={() => applyFilter('service', '')}>Tất cả</button>
                </li>
                {config.service_type.map(s => (
                  <li key={s} className={service === s ? 'active' : ''}>
                    <button onClick={() => applyFilter('service', s)}>{s}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="filter-section">
              <h3>Khoảng giá</h3>
              <ul>
                <li className={!price ? 'active' : ''}>
                  <button onClick={() => applyFilter('price', '')}>Tất cả</button>
                </li>
                {config.price_range.map(p => (
                  <li key={p.value} className={price === String(p.value) ? 'active' : ''}>
                    <button onClick={() => applyFilter('price', String(p.value))}>{p.label}</button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <div className="collections-content">
            <div className="collections-header">
              <h1>Nhà hàng</h1>
              <span className="result-count">{loaded ? `${filtered.length} kết quả` : 'Đang tải...'}</span>
            </div>
            {!loaded ? (
              <div className="collections-grid">
                {Array.from({ length: 9 }).map((_, i) => <div key={i} className="card-skeleton" />)}
              </div>
            ) : (
              <div className="collections-grid">
                {filtered.map(r => (
                  <RestaurantCard key={r.handle} restaurant={r} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
