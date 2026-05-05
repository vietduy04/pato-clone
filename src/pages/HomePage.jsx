import { useState, useMemo, useEffect, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "../components/Carousel";
import RestaurantCard from "../components/RestaurantCard";
import useStore from "../store";
import config from "../data/config.json";
import "./HomePage.css";

const FEATURED_COLLECTION_HANDLES = [
  "pato-de-xuat-top-nha-hang-tai-ha-noi",
  "top-nha-hang-duoc-yeu-thich-tai-tp-ho-chi-minh",
  "kham-pha-tinh-hoa-am-thuc-nhat-ban",
  "o-day-co-nhau-ngon-thu-ngay",
  "quay-banh-trung-tam-thuong-mai-voi-top-cac-nha-hang",
  "tong-hop-nha-hang-mon-viet-nhat-dinh-phai-thu",
];

const SUGGEST_ITEMS = [
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_sug_img1.jpg",
    alt: "Acacias",
    href: "/products/acacias-47-linh-lang",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_sug_img2.jpg",
    alt: "Giang Dung",
    href: "/products/giang-dung-46-25-tho-quan",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_sug_img3.jpg",
    alt: "Vua Ngân",
    href: "/products/vua-ngan-24-tran-binh",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_sug_img4.jpg",
    alt: "Bò Nhúng Dấm 275",
    href: "/collections/bo-nhung-dam-275-ha-noi",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_sug_img5.jpg",
    alt: "Hải sản Biển Đông",
    href: "/collections/hai-san-bien-dong-ha-noi",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_sug_img6.jpg",
    alt: "Đệ Nhất Quán",
    href: "/products/de-nhat-quan-2-ngo-20-lang-ha",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_sug_img7.jpg",
    alt: "Cơm Niêu Singapore",
    href: "/collections/com-nieu-singapore-kombo-ha-noi",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_sug_img8.jpg",
    alt: "Sentosa",
    href: "/products/sentosa-12-huynh-thuc-khang",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_sug_img9.jpg",
    alt: "Vitamin Beer",
    href: "/products/vitamin-beer-76-nguyen-van-tuyet",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_sug_img10.jpg",
    alt: "Lẩu Nướng Wang Wang",
    href: "/collections/lau-nuong-wang-wang-ha-noi",
  },
];

const SERVICE_ITEMS = [
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_service_img1.jpg",
    alt: "Top nhà hàng Quận Hoàn Kiếm",
    href: "/collections/top-nha-hang-tai-quan-hoan-kiem-ha-noi",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_service_img2.jpg",
    alt: "Top nhà hàng Quận Đống Đa",
    href: "/collections/top-nha-hang-tai-quan-dong-da-ha-noi",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_service_img3.jpg",
    alt: "Top nhà hàng Quận Cầu Giấy",
    href: "/collections/top-nha-hang-tai-quan-cau-giay-ha-noi",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_service_img4.jpg",
    alt: "Top nhà hàng Quận Ba Đình",
    href: "/collections/top-nha-hang-tai-quan-ba-dinh-ha-noi",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_service_img5.jpg",
    alt: "Top nhà hàng Quận Tây Hồ",
    href: "/collections/top-nha-hang-tai-quan-tay-ho-ha-noi",
  },
];

const BLOG_COLLECTION_LABELS = {
  healthy: "Healthy",
  "huong-dan": "Hướng dẫn",
  "doi-tac": "Đối tác",
  "top-nha-hang": "Top Nhà Hàng",
  "mon-heo": "Món Heo",
  "van-hoa-viet-nam": "Văn hóa Việt Nam",
  "mon-nhau": "Món Nhậu",
  "mon-chay": "Món Chay",
  "am-thuc-a-au": "Ẩm thực Á-Âu",
  "am-thuc-3-mien": "Ẩm thực 3 miền",
  "hai-san": "Hải sản",
  "rau-cu": "Rau củ",
  "mon-ga": "Món Gà",
  "trang-mieng": "Tráng miệng",
  "mon-bo": "Món Bò",
};

const LOCATION_ITEMS = [
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_location_img1.jpg",
    alt: "Lẩu-Nướng",
    href: "/collections/lau-nuong-buffet-an-tha-ga",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_location_img2.jpg",
    alt: "Hải sản",
    href: "/collections/hai-san-tuoi-ngon-cuc-da",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_location_img3.jpg",
    alt: "Món Hàn",
    href: "/collections/mon-han-dam-da-ban-sac",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_location_img4.jpg",
    alt: "Món Nhật",
    href: "/collections/mon-nhat-vua-ngon-vua-bo",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_location_img5.jpg",
    alt: "Món Thái",
    href: "/collections/mon-thai-chuan-vi-chua-cay",
  },
  {
    img: "//theme.hstatic.net/1000275435/1000883829/14/home_location_img6.jpg",
    alt: "Món Âu",
    href: "/collections/mon-au-an-ngon-view-chanh",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { restaurants, locations, collections, loaded } = useStore();
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/blog_index.json`)
      .then((r) => r.json())
      .then((posts) => {
        const sorted = [...posts].sort((a, b) => (b.date > a.date ? 1 : -1));
        setBlogPosts(sorted);
      })
      .catch(() => {});
  }, []);

  const blogCollections = useMemo(
    () => [...new Set(blogPosts.map((p) => p.collection).filter(Boolean))],
    [blogPosts],
  );
  const recentPosts = blogPosts.slice(0, 8);

  const districtList = province
    ? locations.find((l) => l.province === province)?.districts || []
    : [];

  // O(1) restaurant lookup by handle
  const restaurantByHandle = useMemo(() => {
    const map = new Map();
    restaurants.forEach((r) => map.set(r.handle, r));
    return map;
  }, [restaurants]);

  // Resolve featured collections → [{handle, title, items:[restaurant,...]}]
  const featuredCollections = useMemo(() => {
    return FEATURED_COLLECTION_HANDLES.map((handle) => {
      const col = collections.find((c) => c.handle === handle);
      if (!col) return null;
      const items = col.restaurant_handles
        .map((h) => restaurantByHandle.get(h))
        .filter(Boolean);
      return { handle: col.handle, title: col.title, items };
    }).filter(Boolean);
  }, [collections, restaurantByHandle]);

  function handleAdvancedSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (province) params.set("province", province);
    if (district) params.set("district", district);
    if (priceRange) params.set("price", priceRange);
    if (cuisine) params.set("cuisine", cuisine);
    navigate(`/collections?${params.toString()}`);
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
              breakpoints={{ 0: 1, 640: 2, 992: 4 }}
              autoPlay
              autoPlayInterval={6000}
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
                  {/* <img src="//theme.hstatic.net/1000275435/1000883829/14/nen_tuyet.png" alt="" />*/}
                </div>
                <form
                  className="search-pro-form"
                  onSubmit={handleAdvancedSearch}
                >
                  <div className="search-pro-fields">
                    <div className="search-field">
                      <select
                        value={province}
                        onChange={(e) => {
                          setProvince(e.target.value);
                          setDistrict("");
                        }}
                      >
                        <option value="">Tỉnh / Thành phố</option>
                        {locations.map((l) => (
                          <option key={l.province} value={l.province}>
                            {l.province}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="search-field">
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        disabled={!province}
                      >
                        <option value="">Quận / Huyện</option>
                        {districtList.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="search-field">
                      <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                      >
                        <option value="">Khoảng giá</option>
                        {config.price_range.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="search-field">
                      <select
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value)}
                      >
                        <option value="">Loại hình ẩm thực</option>
                        {config.cuisine_main.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="search-field search-submit">
                      <button type="submit" className="btn-search-pro">
                        Tìm kiếm
                      </button>
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
              breakpoints={{ 0: 1, 640: 2, 992: 4 }}
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
              {LOCATION_ITEMS.map((item) => (
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

      {/* Featured restaurants — one carousel per collection */}
      {!loaded
        ? FEATURED_COLLECTION_HANDLES.map((handle) => (
            <section key={handle} className="home-collection-section">
              <div className="wrapper">
                <div className="inner">
                  <div className="section-title clearfix">
                    <div className="home-collection-skeleton-title" />
                  </div>
                  <div className="home-collection-skeleton-row">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="card-skeleton" />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))
        : featuredCollections.map((col, colIndex) => (
            <Fragment key={col.handle}>
              <section className="home-collection-section">
                <div className="wrapper">
                  <div className="inner">
                    <div className="section-title clearfix">
                      <h2>{col.title}</h2>
                      <div className="view_more">
                        <Link to={`/collections/${col.handle}`}>
                          <strong>Xem thêm</strong>
                        </Link>
                      </div>
                    </div>
                    <Carousel
                      items={col.items}
                      fixedWidth={300}
                      gap={20}
                      renderItem={(r) => <RestaurantCard restaurant={r} />}
                    />
                  </div>
                </div>
              </section>
              {colIndex === 2 && (
                <section className="home-partner-banner">
                  <div className="wrapper">
                    <Link to="/pages/dang-ky-doi-tac">
                      <img
                        src="//theme.hstatic.net/1000275435/1000883829/14/choose_1.png?v=1150"
                        alt="Đăng ký đối tác PATO"
                      />
                    </Link>
                  </div>
                </section>
              )}
            </Fragment>
          ))}
      {/* Blog section */}
      <section id="home-blog">
        <div className="home-blog-banner">
          <div className="wrapper">
            <img
              src="//theme.hstatic.net/1000275435/1000883829/14/choose_2.png"
              alt="Blog PATO"
            />
          </div>
        </div>
        <div className="wrapper">
          <div className="inner">
            {blogCollections.length > 0 && (
              <div className="home-blog-collections">
                {blogCollections.map((col) => (
                  <Link
                    key={col}
                    to={`/blogs/?collection=${col}`}
                    className="home-blog-pill"
                  >
                    {BLOG_COLLECTION_LABELS[col] || col}
                  </Link>
                ))}
              </div>
            )}
            <div className="home-blog-grid">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blogs/${post.slug}`}
                  className="home-blog-card"
                >
                  <div className="home-blog-card-img">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="home-blog-card-body">
                    <p className="home-blog-card-title">{post.title}</p>
                    <span className="home-blog-card-date">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {post.date
                        ? new Date(post.date).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="home-blog-cta">
              <Link to="/blogs" className="btn-view-all-blogs">
                Xem tất cả tin tức
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="home-step">
        <div className="wrapper">
          <div className="inner">
            <div className="section-title">
              <h2 className="text-center">Hướng dẫn đặt bàn</h2>
              <p>
                Xem chi tiết hướng dẫn{" "}
                <a href="https://pato.com.vn/blogs/news/huong-dan-dat-ban-tai-pato-kenh-thong-tin-va-dat-ban-nha-hang">
                  tại đây
                </a>
              </p>
            </div>
            <div className="home-step-grid">
              <div className="home-step-item">
                {/* <div className="step-number">1</div>*/}
                <img
                  className="step-img"
                  src="//theme.hstatic.net/1000275435/1000883829/14/step_img1.png"
                  alt="Chọn nhà hàng"
                />
                <p className="text-step">CHỌN NHÀ HÀNG</p>
                <p className="sub-step">Hàng ngàn Nhà hàng với nhiều ưu đãi</p>
                <img
                  src="//theme.hstatic.net/1000275435/1000883829/14/left-black-arrow.png"
                  className="step-arrow"
                  alt=""
                />
              </div>
              <div className="home-step-item">
                {/* <div className="step-number">2</div>*/}
                <img
                  className="step-img"
                  src="//theme.hstatic.net/1000275435/1000883829/14/step_img2.png"
                  alt="Gọi đặt chỗ"
                />
                <p className="text-step">
                  GỌI ĐẶT CHỖ <br /> 1900.2280
                </p>
                <p className="sub-step"></p>
                <span className="step-or">Hoặc</span>
              </div>
              <div className="home-step-item">
                <img
                  className="step-img"
                  src="//theme.hstatic.net/1000275435/1000883829/14/step_img3.png"
                  alt="Đặt bàn online"
                />
                <p className="text-step">ĐẶT BÀN ONLINE</p>
                <p className="sub-step">Truy cập Website www.pato.com.vn</p>
                <img
                  src="//theme.hstatic.net/1000275435/1000883829/14/left-black-arrow.png"
                  className="step-arrow"
                  alt=""
                />
              </div>
              <div className="home-step-item">
                {/* <div className="step-number">3</div>*/}
                <img
                  className="step-img"
                  src="//theme.hstatic.net/1000275435/1000883829/14/step_img4.png"
                  alt="Xác nhận"
                />
                <p className="text-step">XÁC NHẬN</p>
                <p className="sub-step">Xác nhận từ tổng đài viên PATO</p>
                <img
                  src="//theme.hstatic.net/1000275435/1000883829/14/left-black-arrow.png"
                  className="step-arrow"
                  alt=""
                />
              </div>
              <div className="home-step-item">
                {/* <div className="step-number">4</div>*/}
                <img
                  className="step-img"
                  src="//theme.hstatic.net/1000275435/1000883829/14/step_img5.png"
                  alt="Thưởng thức"
                />
                <p className="text-step">THƯỞNG THỨC</p>
                <p className="sub-step">Thưởng thức món ngon tại nhà hàng</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
