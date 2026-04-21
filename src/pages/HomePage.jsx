import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Carousel from '../components/Carousel'
import RestaurantCard from '../components/RestaurantCard'
import useStore from '../store'
import config from '../data/config.json'
import './HomePage.css'

const SUGGEST_ITEMS = [
  { img: '/images/home_sug_img1.jpg', alt: 'Acacias', href: '/products/acacias-47-linh-lang' },
  { img: '/images/home_sug_img2.jpg', alt: 'Giang Dung', href: '/products/giang-dung-46-25-tho-quan' },
  { img: '/images/home_sug_img3.jpg', alt: 'Vua Ngân', href: '/products/vua-ngan-24-tran-binh' },
  { img: '/images/home_sug_img4.jpg', alt: 'Bò Nhúng Dấm 275', href: '/collections/bo-nhung-dam-275-ha-noi' },
  { img: '/images/home_sug_img5.jpg', alt: 'Hải sản Biển Đông', href: '/collections/hai-san-bien-dong-ha-noi' },
  { img: '/images/home_sug_img6.jpg', alt: 'Đệ Nhất Quán', href: '/products/de-nhat-quan-2-ngo-20-lang-ha' },
  { img: '/images/home_sug_img7.jpg', alt: 'Cơm Niêu Singapore', href: '/collections/com-nieu-singapore-kombo-ha-noi' },
  { img: '/images/home_sug_img8.jpg', alt: 'Sentosa', href: '/products/sentosa-12-huynh-thuc-khang' },
  { img: '/images/home_sug_img9.jpg', alt: 'Vitamin Beer', href: '/products/vitamin-beer-76-nguyen-van-tuyet' },
  { img: '/images/home_sug_img10.jpg', alt: 'Lẩu Nướng Wang Wang', href: '/collections/lau-nuong-wang-wang-ha-noi' },
]

const SERVICE_ITEMS = [
  { img: '/images/home_service_img1.jpg', alt: 'Top nhà hàng Quận Hoàn Kiếm', href: '/collections/top-nha-hang-tai-quan-hoan-kiem-ha-noi' },
  { img: '/images/home_service_img2.jpg', alt: 'Top nhà hàng Quận Đống Đa', href: '/collections/top-nha-hang-tai-quan-dong-da-ha-noi' },
  { img: '/images/home_service_img3.jpg', alt: 'Top nhà hàng Quận Cầu Giấy', href: '/collections/top-nha-hang-tai-quan-cau-giay-ha-noi' },
  { img: '/images/home_service_img4.jpg', alt: 'Top nhà hàng Quận Ba Đình', href: '/collections/top-nha-hang-tai-quan-ba-dinh-ha-noi' },
  { img: '/images/home_service_img5.jpg', alt: 'Top nhà hàng Quận Tây Hồ', href: '/collections/top-nha-hang-tai-quan-tay-ho-ha-noi' },
]

const LOCATION_ITEMS = [
  { img: '/images/home_location_img1.jpg', alt: 'Lẩu-Nướng', href: '/collections/lau-nuong-buffet-an-tha-ga' },
  { img: '/images/home_location_img2.jpg', alt: 'Hải sản', href: '/collections/hai-san-tuoi-ngon-cuc-da' },
  { img: '/images/home_location_img3.jpg', alt: 'Món Hàn', href: '/collections/mon-han-dam-da-ban-sac' },
  { img: '/images/home_location_img4.jpg', alt: 'Món Nhật', href: '/collections/mon-nhat-vua-ngon-vua-bo' },
  { img: '/images/home_location_img5.jpg', alt: 'Món Thái', href: '/collections/mon-thai-chuan-vi-chua-cay' },
  { img: '/images/home_location_img6.jpg', alt: 'Món Âu', href: '/collections/mon-au-an-ngon-view-chanh' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { restaurants, locations, loaded } = useStore()
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [cuisine, setCuisine] = useState('')

  const districtList = province
    ? (locations.find(l => l.province === province)?.districts || [])
    : []

  const featured = restaurants.slice(0, 12)

  function handleAdvancedSearch(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (province) params.set('province', province)
    if (district) params.set('district', district)
    if (priceRange) params.set('price', priceRange)
    if (cuisine) params.set('cuisine', cuisine)
    navigate(`/collections?${params.toString()}`)
  }

  return (
    <div className="homepage">
      {/* Suggest section */}
      <section id="home-suggest">
        <div className="wrapper">
          <div className="inner">
            <div className="section-title">
              <h2>Ưu đãi siêu khủng chỉ có tại PATO</h2>
              <p>ƯU ĐÃI ngập tràn, ĐẶT BÀN nhanh gọn, TIẾT KIỆM thời gian</p>
            </div>
            <Carousel
              items={SUGGEST_ITEMS}
              itemsPerView={4}
              renderItem={(item) => (
                <div className="hpromo-item">
                  <Link to={item.href}>
                    <img src={item.img} alt={item.alt} loading="lazy" />
                  </Link>
                </div>
              )}
            />
          </div>
        </div>
      </section>

      {/* Advanced search */}
      <section className="home-search-section">
        <div className="module_search_pro">
          <div className="wrapper">
            <div className="inner">
              <div className="section-title">
                <h2>Tìm kiếm nâng cao</h2>
                <p>Tìm kiếm nhà hàng phù hợp với nhu cầu của bạn</p>
              </div>
              <div className="search-pro-wrap">
                <div className="search-bg">
                  <img src="/images/nen_tuyet.png" alt="" />
                </div>
                <form className="search-pro-form" onSubmit={handleAdvancedSearch}>
                  <div className="search-pro-fields">
                    <div className="search-field">
                      <select value={province} onChange={e => { setProvince(e.target.value); setDistrict('') }}>
                        <option value="">Tỉnh / Thành phố</option>
                        {locations.map(l => (
                          <option key={l.province} value={l.province}>{l.province}</option>
                        ))}
                      </select>
                    </div>
                    <div className="search-field">
                      <select value={district} onChange={e => setDistrict(e.target.value)} disabled={!province}>
                        <option value="">Quận / Huyện</option>
                        {districtList.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div className="search-field">
                      <select value={priceRange} onChange={e => setPriceRange(e.target.value)}>
                        <option value="">Khoảng giá</option>
                        {config.price_range.map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="search-field">
                      <select value={cuisine} onChange={e => setCuisine(e.target.value)}>
                        <option value="">Loại hình ẩm thực</option>
                        {config.cuisine_main.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="search-field search-submit">
                      <button type="submit" className="btn-search-pro">Tìm kiếm</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Home service */}
      <section id="home-service">
        <div className="wrapper">
          <div className="inner">
            <div className="section-title">
              <h2>Top Nhà hàng theo Khu vực tại Hà Nội</h2>
            </div>
            <Carousel
              items={SERVICE_ITEMS}
              itemsPerView={4}
              renderItem={(item) => (
                <div className="hservice-item">
                  <Link to={item.href}>
                    <img src={item.img} alt={item.alt} loading="lazy" />
                  </Link>
                </div>
              )}
            />
          </div>
        </div>
      </section>

      {/* Home location */}
      <section id="home-location">
        <div className="wrapper">
          <div className="inner">
            <div className="section-title">
              <h2>Bạn đang tìm gì?</h2>
            </div>
            <div className="home-location-grid">
              {LOCATION_ITEMS.map(item => (
                <div key={item.href} className="hpromo-item">
                  <Link to={item.href}>
                    <img src={item.img} alt={item.alt} loading="lazy" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured restaurants */}
      <section className="home-choose">
        <div className="wrapper">
          <div className="inner">
            <div className="section-title clearfix">
              <h2>Pato đề xuất Top Nhà hàng tại Hà Nội</h2>
              <div className="view_more">
                <Link to="/collections"><strong>Xem thêm</strong></Link>
              </div>
            </div>
            {!loaded ? (
              <div className="loading-cards">
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="card-skeleton" />)}
              </div>
            ) : (
              <div className="home-choose-grid">
                {featured.map(r => (
                  <RestaurantCard key={r.handle} restaurant={r} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
