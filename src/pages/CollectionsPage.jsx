import { useState, useMemo } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import posthog from 'posthog-js'
import RestaurantCard from '../components/RestaurantCard'
import useStore from '../store'
import config from '../data/config.json'
import './CollectionsPage.css'

const PAGE_SIZE = 24

export default function CollectionsPage() {
  const { restaurants, collections, locations, loaded } = useStore()
  const { handle } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [cuisine, setCuisine] = useState(searchParams.get('cuisine') || '')
  const [service, setService] = useState(searchParams.get('service') || '')
  const [price, setPrice] = useState(searchParams.get('price') || '')
  const [province, setProvince] = useState(searchParams.get('province') || '')
  const [district, setDistrict] = useState(searchParams.get('district') || '')

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

  // Find the matching collection (if a handle is in the URL)
  const collection = useMemo(
    () => (handle ? collections.find(c => c.handle === handle) : null),
    [collections, handle]
  )

  // Districts for the selected province
  const districts = useMemo(() => {
    if (!province) return []
    const loc = locations.find(l => l.province === province)
    return loc ? loc.districts : []
  }, [locations, province])

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
      if (province && r.province !== province) return false
      if (district && r.district !== district) return false
      return true
    })
  }, [restaurants, collection, cuisine, service, price, province, district])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function applyFilter(key, val) {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val)
    else p.delete(key)
    // Any filter change resets to page 1
    p.delete('page')
    // Changing province resets district
    if (key === 'province') p.delete('district')
    setSearchParams(p)
    if (key === 'cuisine') setCuisine(val)
    if (key === 'service') setService(val)
    if (key === 'price') setPrice(val)
    if (key === 'province') { setProvince(val); setDistrict('') }
    if (key === 'district') setDistrict(val)
    if (val) posthog.capture('filter_applied', { filter_type: key, value: val, collection: handle || null })
  }

  function goToPage(n) {
    const p = new URLSearchParams(searchParams)
    if (n === 1) p.delete('page')
    else p.set('page', String(n))
    setSearchParams(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
              <h3>Khu vực</h3>
              <div className="filter-dropdowns">
                <select
                  value={province}
                  onChange={e => applyFilter('province', e.target.value)}
                >
                  <option value="">Tất cả tỉnh/thành</option>
                  {locations.map(l => (
                    <option key={l.province} value={l.province}>{l.province}</option>
                  ))}
                </select>
                <select
                  value={district}
                  onChange={e => applyFilter('district', e.target.value)}
                  disabled={!province}
                >
                  <option value="">Tất cả quận/huyện</option>
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
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
              <span className="result-count">
                {loaded ? `${filtered.length} kết quả` : 'Đang tải...'}
              </span>
            </div>
            {!loaded ? (
              <div className="collections-grid">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => <div key={i} className="card-skeleton" />)}
              </div>
            ) : handle && !collection ? (
              <div className="collection-not-found">
                <p>Không tìm thấy bộ sưu tập này.</p>
              </div>
            ) : (
              <>
                <div className="collections-grid">
                  {pageItems.map(r => (
                    <RestaurantCard key={r.handle} restaurant={r} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ‹
                    </button>
                    {buildPageNumbers(currentPage, totalPages).map((n, i) =>
                      n === '...' ? (
                        <span key={`ellipsis-${i}`} className="pagination-ellipsis">…</span>
                      ) : (
                        <button
                          key={n}
                          className={`pagination-btn${n === currentPage ? ' active' : ''}`}
                          onClick={() => goToPage(n)}
                        >
                          {n}
                        </button>
                      )
                    )}
                    <button
                      className="pagination-btn"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function buildPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = []
  pages.push(1)
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}
