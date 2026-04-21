import { useParams, Link } from 'react-router-dom'
import useStore from '../store'
import './ProductPage.css'

const PRICE_LABELS = {
  '1': 'Dưới 200.000đ/khách',
  '2': 'Từ 200.000 - 300.000đ/khách',
  '3': 'Từ 300.000 - 400.000đ/khách',
  '4': 'Từ 400.000 - 500.000đ/khách',
  '5': 'Trên 500.000đ/khách',
}

export default function ProductPage() {
  const { handle } = useParams()
  const { restaurants, loaded } = useStore()

  if (!loaded) {
    return (
      <div className="wrapper" style={{ padding: '60px 0', textAlign: 'center', color: '#666' }}>
        Đang tải...
      </div>
    )
  }

  const r = restaurants.find(rest => rest.handle === handle)

  if (!r) {
    return (
      <div className="wrapper" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h1>Không tìm thấy nhà hàng</h1>
        <Link to="/collections" style={{ color: 'var(--brand)' }}>← Quay lại danh sách</Link>
      </div>
    )
  }

  const amenities = r.amenities ? JSON.parse(r.amenities) : {}

  return (
    <div className="product-page">
      <div className="wrapper">
        <div className="product-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span> / </span>
          <Link to="/collections">Nhà hàng</Link>
          <span> / </span>
          <span>{r.title}</span>
        </div>

        <div className="product-layout">
          <div className="product-gallery">
            <div className="gallery-main">
              <img src={r.thumbnail} alt={r.title} />
            </div>
            {r.images?.length > 0 && (
              <div className="gallery-thumbs">
                {r.images.slice(0, 6).map((img, i) => (
                  <img key={i} src={img} alt={`${r.title} ${i + 1}`} loading="lazy" />
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <h1>{r.title}</h1>
            <div className="product-meta">
              <div className="meta-row">
                <span className="meta-label">📍 Địa chỉ:</span>
                <span>{r.address}</span>
              </div>
              {r.price_range && (
                <div className="meta-row">
                  <span className="meta-label">💰 Giá:</span>
                  <span>{PRICE_LABELS[r.price_range]}</span>
                </div>
              )}
              {r.service_type && (
                <div className="meta-row">
                  <span className="meta-label">🍽️ Dịch vụ:</span>
                  <span>{r.service_type}</span>
                </div>
              )}
              {r.cuisine_all?.length > 0 && (
                <div className="meta-row">
                  <span className="meta-label">🥢 Ẩm thực:</span>
                  <span>{r.cuisine_all.join(', ')}</span>
                </div>
              )}
              {r.status && (
                <div className="meta-row">
                  <span className="meta-label">📋 Trạng thái:</span>
                  <span className={r.status === 'Đã hợp tác' ? 'status-active' : ''}>{r.status}</span>
                </div>
              )}
            </div>

            {r.opening_hours && (
              <div className="opening-hours">
                <h3>Giờ mở cửa</h3>
                <table>
                  <tbody>
                    {Object.entries(r.opening_hours).map(([day, hours]) => (
                      <tr key={day}><td>{day}</td><td>{hours}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {Object.keys(amenities).length > 0 && (
              <div className="amenities">
                <h3>Tiện ích</h3>
                <div className="amenities-grid">
                  {Object.entries(amenities)
                    .filter(([k, v]) => v === true && k !== 'discount_available')
                    .map(([k]) => (
                      <span key={k} className="amenity-tag">✓ {k}</span>
                    ))}
                </div>
              </div>
            )}

            <div className="booking-cta">
              <a href="tel:19002280" className="btn-booking-main">
                Đặt bàn ngay — 1900.2280
              </a>
            </div>
          </div>
        </div>

        {r.description && (
          <div className="product-description">
            <h2>Giới thiệu</h2>
            <div className="description-text">
              {r.description.split('\n').filter(Boolean).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        )}

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
      </div>
    </div>
  )
}
