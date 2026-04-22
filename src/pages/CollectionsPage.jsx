import { useState, useMemo } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import posthog from 'posthog-js'
import RestaurantCard from '../components/RestaurantCard'
import useStore from '../store'
import config from '../data/config.json'
import './CollectionsPage.css'

export default function CollectionsPage() {
  const { restaurants, collections, loaded } = useStore()
  const { handle } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [cuisine, setCuisine] = useState(searchParams.get('cuisine') || '')
  const [service, setService] = useState(searchParams.get('service') || '')
  const [price, setPrice] = useState(searchParams.get('price') || '')

  // Find the matching collection (if a handle is in the URL)
  const collection = useMemo(
    () => (handle ? collections.find(c => c.handle === handle) : null),
    [collections, handle]
  )

  // Pre-filter to collection members, then apply sidebar filters on top
  const filtered = useMemo(() => {
    const collectionSet = collection
      ? new Set(collection.restaurant_handles)
      : null

    return restaurants.filter(r => {
      if (collectionSet && !collectionSet.has(r.handle)) return false
      if (cuisine && !r.cuisine_all?.includes(cuisine)) return false
      if (service && r.service_type !== service) return false
      if (price && r.price_range !== price) return false
      return true
    })
  }, [restaurants, collection, cuisine, service, price])

  function applyFilter(key, val) {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val)
    else p.delete(key)
    setSearchParams(p)
    if (key === 'cuisine') setCuisine(val)
    if (key === 'service') setService(val)
    if (key === 'price') setPrice(val)
    if (val) posthog.capture('filter_applied', { filter_type: key, value: val, collection: handle || null })
  }

  const pageTitle = collection ? collection.title : 'Nhà hàng'

  return (
    <div className="collections-page">
      {collection && (
        <div className="collection-banner">
          <div className="wrapper">
            <h1 className="collection-banner-title">{collection.title}</h1>
          </div>
        </div>
      )}
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
              <h1>{!collection ? pageTitle : ''}</h1>
              <span className="result-count">{loaded ? `${filtered.length} kết quả` : 'Đang tải...'}</span>
            </div>
            {!loaded ? (
              <div className="collections-grid">
                {Array.from({ length: 9 }).map((_, i) => <div key={i} className="card-skeleton" />)}
              </div>
            ) : handle && !collection ? (
              <div className="collection-not-found">
                <p>Không tìm thấy bộ sưu tập này.</p>
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
