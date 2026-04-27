import { useMemo, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import posthog from 'posthog-js'
import useStore from '../store'
import Carousel from '../components/Carousel'
import RestaurantCard from '../components/RestaurantCard'
import Breadcrumb from '../components/Breadcrumb'
import './ProductPage.css'

const PRICE_LABELS = {
  '1': 'Dưới 200.000đ/khách',
  '2': 'Từ 200.000 - 300.000đ/khách',
  '3': 'Từ 300.000 - 400.000đ/khách',
  '4': 'Từ 400.000 - 500.000đ/khách',
  '5': 'Trên 500.000đ/khách',
}

const renderInline = (text) => {
  const parts = text.split(/\*{2,3}(.+?)\*\*/g)
  return parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)
}

function renderMarkdown(description) {
  const lines = description.split('\n').filter(Boolean)
  const result = []
  let i = 0
  while (i < lines.length) {
    if (lines[i].startsWith('- ')) {
      const items = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(<li key={i}>{renderInline(lines[i].slice(2))}</li>)
        i++
      }
      result.push(<ul key={`ul-${i}`}>{items}</ul>)
    } else {
      result.push(<p key={i}>{renderInline(lines[i])}</p>)
      i++
    }
  }
  return result
}

function Lightbox({ images, index, onClose, onPrev, onNext }) {
  if (index === null) return null
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-btn lightbox-prev" onClick={e => { e.stopPropagation(); onPrev() }} aria-label="Previous">‹</button>
      <img
        className="lightbox-img"
        src={images[index]}
        alt={`Image ${index + 1}`}
        onClick={e => e.stopPropagation()}
      />
      <button className="lightbox-btn lightbox-next" onClick={e => { e.stopPropagation(); onNext() }} aria-label="Next">›</button>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">×</button>
    </div>
  )
}

export default function ProductPage() {
  const { handle } = useParams()
  const { restaurants, loaded } = useStore()
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const r = loaded ? restaurants.find(rest => rest.handle === handle) : null

  const allImages = useMemo(() => {
    if (!r) return []
    return [r.thumbnail, ...(r.images ?? [])].filter(Boolean)
  }, [r])

  const openLightbox = useCallback((i) => setLightboxIndex(i), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevImage = useCallback(() => setLightboxIndex(i => (i > 0 ? i - 1 : allImages.length - 1)), [allImages.length])
  const nextImage = useCallback(() => setLightboxIndex(i => (i < allImages.length - 1 ? i + 1 : 0)), [allImages.length])

  const related = useMemo(() => {
    if (!r) return []
    return restaurants.filter(
      rest =>
        rest.handle !== r.handle &&
        rest.province === r.province &&
        rest.district === r.district &&
        rest.cuisine_main === r.cuisine_main
    )
  }, [restaurants, r])

  if (!loaded) {
    return (
      <div className="wrapper" style={{ padding: '60px 0', textAlign: 'center', color: '#666' }}>
        Đang tải...
      </div>
    )
  }

  if (!r) {
    return (
      <div className="wrapper" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h1>Không tìm thấy nhà hàng</h1>
        <Link to="/collections" style={{ color: 'var(--brand)' }}>← Quay lại danh sách</Link>
      </div>
    )
  }

  const amenities = r.amenities ? JSON.parse(r.amenities) : {}
  const amenityList = Object.entries(amenities).filter(([k, v]) => v === true && k !== 'discount_available').map(([k]) => k)

  const sideThumbImages = allImages.slice(1, 5)
  const hasMore = allImages.length > 5

  return (
    <div className="product-page">
      <div className="wrapper">
        <Breadcrumb items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Nhà hàng', href: '/collections' },
          { label: r.title },
        ]} />

        <div className="product-layout">
          {/* ── LEFT: main content ── */}
          <div className="product-main">

            {/* Gallery */}
            <div className="gallery-wrap">
              <div className="gallery-main-img" onClick={() => openLightbox(0)}>
                <img src={r.thumbnail} alt={r.title} />
              </div>
              {sideThumbImages.length > 0 && (
                <div className="gallery-side">
                  {sideThumbImages.map((img, i) => {
                    const isLast = i === 3 || (i === sideThumbImages.length - 1 && hasMore && i === sideThumbImages.length - 1)
                    const showOverlay = hasMore && i === Math.min(sideThumbImages.length - 1, 3)
                    return (
                      <div key={i} className="gallery-thumb-cell" onClick={() => openLightbox(i + 1)}>
                        <img src={img} alt={`${r.title} ${i + 2}`} loading="lazy" />
                        {showOverlay && allImages.length > 5 && (
                          <div className="gallery-see-all-overlay">
                            <span>Xem tất cả<br />{allImages.length} hình ảnh</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Title / address / tags */}
            <div className="product-header">
              <h1>{r.title}</h1>
              {r.address && (
                <div className="product-address">
                  <span className="address-icon">📍</span>
                  {r.address}
                </div>
              )}
              {r.cuisine_all?.length > 0 && (
                <div className="cuisine-tags">
                  {r.cuisine_all.map(c => (
                    <span key={c} className="cuisine-tag">{c}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Promotions */}
            {r.promotions?.length > 0 && (
              <div className="product-promotions">
                <h2>Khuyến mãi</h2>
                {r.promotions.map((p, i) => (
                  <div key={i} className="promo-card">
                    <div className="promo-body">
                      <strong className="promo-title">{p.title}</strong>
                      {p.description && (
                        <div className="promo-desc">{renderInline(p.description)}</div>
                      )}
                    </div>
                    <a
                      href="tel:19002280"
                      className="btn-promo-book"
                      onClick={() => posthog.capture('promo_book_click', { restaurant_handle: r.handle, promo_title: p.title })}
                    >
                      Đặt ngay
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            {r.description && (
              <div className="product-description">
                <h2>Giới thiệu</h2>
                <div className="description-text">
                  {renderMarkdown(r.description)}
                </div>
              </div>
            )}

            {/* Menu carousel */}
            {r.menu?.length > 0 && (
              <div className="product-menu">
                <h2>Thực đơn</h2>
                <Carousel
                  items={r.menu}
                  itemsPerView={1}
                  gap={0}
                  renderItem={(img, i) => (
                    <img
                      src={img}
                      alt={`Menu ${i + 1}`}
                      className="menu-carousel-img"
                      loading="lazy"
                    />
                  )}
                />
              </div>
            )}

            {/* Map */}
            {r.gmaps && (
              <div className="product-map">
                <h2>Bản đồ</h2>
                <iframe
                  src={r.gmaps}
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: 8 }}
                  allowFullScreen
                  loading="lazy"
                  title="Bản đồ"
                />
              </div>
            )}

            {/* Related */}
            {related.length > 0 && (
              <div className="product-related">
                <h2>Các địa điểm liên quan</h2>
                <Carousel
                  items={related}
                  itemsPerView={3}
                  gap={20}
                  renderItem={rest => <RestaurantCard restaurant={rest} />}
                />
              </div>
            )}
          </div>

          {/* ── RIGHT: sticky sidebar ── */}
          <div className="product-sidebar">
            {/* Card 1: Booking */}
            <div className="sidebar-card sidebar-booking">
              <div className="sidebar-restaurant-name">{r.title}</div>
              {r.discount && r.discount_details && (
                <div className="sidebar-discount">{r.discount_details}</div>
              )}
              <a
                href="tel:19002280"
                className="btn-sidebar-book"
                onClick={() => posthog.capture('booking_cta_click', { restaurant_handle: r.handle })}
              >
                Đặt ngay
              </a>
              <div className="sidebar-phone-text">
                hoặc gọi tới: <strong>1900.2280</strong> để đặt chỗ và được tư vấn
              </div>
            </div>

            {/* Card 2: Info */}
            <div className="sidebar-card sidebar-info">
              {r.opening_hours && (
                <div className="sidebar-section">
                  <div className="sidebar-section-title">Giờ hoạt động</div>
                  <table className="hours-table">
                    <tbody>
                      {Object.entries(r.opening_hours).map(([day, hours]) => (
                        <tr key={day}><td>{day}</td><td>{hours}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="sidebar-section">
                <div className="sidebar-section-title">Thông tin thêm</div>
                <div className="info-rows">
                  {r.price_range && (
                    <div className="info-row">
                      <span className="info-label">Giá</span>
                      <span>{PRICE_LABELS[r.price_range]}</span>
                    </div>
                  )}
                  {r.service_type && (
                    <div className="info-row">
                      <span className="info-label">Dịch vụ</span>
                      <span>{r.service_type}</span>
                    </div>
                  )}
                  {r.status && (
                    <div className="info-row">
                      <span className="info-label">Trạng thái</span>
                      <span className={r.status === 'Đã hợp tác' ? 'status-active' : ''}>{r.status}</span>
                    </div>
                  )}
                  {amenityList.length > 0 && (
                    <div className="info-row info-row-amenities">
                      <span className="info-label">Tiện ích</span>
                      <div className="amenities-grid">
                        {amenityList.map(k => (
                          <span key={k} className="amenity-tag">✓ {k}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        images={allImages}
        index={lightboxIndex}
        onClose={closeLightbox}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </div>
  )
}
