import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store";
import "./Header.css";

const NAV_LINKS = [
  { label: "Giới thiệu", to: "/pages/gioi-thieu" },
  { label: "Liên hệ hợp tác", to: "/pages/lien-he" },
  {
    label: "Đề án cung cấp dịch vụ TMĐT",
    to: "/pages/de-an-cung-cap-dich-vu-thuong-mai-dien-tu",
  },
];

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debounceRef = useRef(null);
  const restaurants = useStore((s) => s.restaurants);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      setMobileSearchOpen(false);
    }
  }

  function handleQueryChange(val) {
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const q = val.toLowerCase();
      const results = restaurants
        .filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.address.toLowerCase().includes(q),
        )
        .slice(0, 8);
      setSuggestions(results);
      setShowSuggestions(true);
    }, 300);
  }

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      {/* Mobile Nav Drawer */}
      <div className={`nav-drawer ${mobileNavOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <span>Menu</span>
          <button onClick={() => setMobileNavOpen(false)}>✕</button>
        </div>
        <ul className="mobile-nav">
          <li>
            <a href="tel:19002280">📞 Hotline: 1900.2280</a>
          </li>
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} onClick={() => setMobileNavOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {mobileNavOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <header id="header">
        {/* Desktop header */}
        <div className="header-desktop">
          <div className="header-top">
            <div className="wrapper">
              <div className="header-top-inner">
                {/* Logo + search */}
                <div className="header-logo-search">
                  <div className="header-logo">
                    <Link to="/">
                      <img
                        src="//theme.hstatic.net/1000275435/1000883829/14/logo.png"
                        alt="PATO - Kênh thông tin và đặt bàn Nhà hàng"
                      />
                    </Link>
                  </div>
                  <div className="header-search-wrap" ref={searchRef}>
                    <form
                      onSubmit={handleSearch}
                      className="header-search-form"
                    >
                      <div className="search-input-wrap">
                        <input
                          type="text"
                          value={query}
                          onChange={(e) => handleQueryChange(e.target.value)}
                          placeholder="Tìm kiếm nhà hàng phù hợp"
                          autoComplete="off"
                        />
                        <button type="submit" className="search-btn">
                          <svg
                            width="16"
                            viewBox="0 0 53.627 53.627"
                            fill="currentColor"
                          >
                            <path d="M53.627,49.385L37.795,33.553C40.423,30.046,42,25.709,42,21C42,9.42,32.58,0,21,0S0,9.42,0,21s9.42,21,21,21c4.709,0,9.046-1.577,12.553-4.205l15.832,15.832L53.627,49.385z M2,21C2,10.523,10.523,2,21,2s19,8.523,19,19s-8.523,19-19,19S2,31.477,2,21z" />
                          </svg>
                        </button>
                      </div>
                    </form>
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="search-suggestions">
                        {suggestions.map((r) => (
                          <Link
                            key={r.handle}
                            to={`/products/${r.handle}`}
                            className="suggestion-item"
                            onClick={() => {
                              setShowSuggestions(false);
                              setQuery("");
                            }}
                          >
                            <img src={r.thumbnail} alt={r.title} />
                            <div className="suggestion-title">
                              {r.title}
                              {r.status === "Đã hợp tác" && (
                                <span className="star-icon">⭐</span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Right: hotline */}
                <div className="header-right">
                  <a href="tel:19002280" className="hotline-link">
                    <svg width="18" viewBox="0 0 512 512" fill="currentColor">
                      <path d="m256 0c-140.609375 0-256 115.390625-256 256 0 46.40625 12.511719 91.582031 36.238281 131.105469l-36.238281 124.894531 124.894531-36.238281c39.523438 23.726562 84.699219 36.238281 131.105469 36.238281 140.609375 0 256-115.390625 256-256s-115.390625-256-256-256zm160.054688 364.167969-11.910157 11.910156c-16.851562 16.851563-55.605469 15.515625-80.507812 10.707031-82.800781-15.992187-179.335938-109.5625-197.953125-190.59375-9.21875-40.140625-4.128906-75.039062 9.183594-88.355468l11.910156-11.910157c6.574218-6.570312 17.253906-6.5625 23.820312 0l47.648438 47.652344c3.179687 3.179687 4.921875 7.394531 4.921875 11.90625s-1.742188 8.730469-4.921875 11.898437l-11.90625 11.921876c-13.125 13.15625-13.125 34.527343 0 47.652343l78.683594 77.648438c13.164062 13.164062 34.46875 13.179687 47.652343 0l11.910157-11.90625c6.148437-6.183594 17.632812-6.203125 23.832031 0l47.636719 47.636719c6.46875 6.441406 6.714843 17.113281 0 23.832031z" />
                    </svg>
                    Hotline: 1900.2280
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className="header-mobile">
          <div className="wrapper">
            <div className="header-mobile-inner">
              <button
                className="hd-btnMenu"
                onClick={() => setMobileNavOpen(true)}
              >
                <svg width="24" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M491.318,235.318H20.682C9.26,235.318,0,244.577,0,256s9.26,20.682,20.682,20.682h470.636c11.423,0,20.682-9.259,20.682-20.682C512,244.578,502.741,235.318,491.318,235.318z" />
                  <path d="M491.318,78.439H20.682C9.26,78.439,0,87.699,0,99.121c0,11.422,9.26,20.682,20.682,20.682h470.636c11.423,0,20.682-9.26,20.682-20.682C512,87.699,502.741,78.439,491.318,78.439z" />
                  <path d="M491.318,392.197H20.682C9.26,392.197,0,401.456,0,412.879s9.26,20.682,20.682,20.682h470.636c11.423,0,20.682-9.259,20.682-20.682S502.741,392.197,491.318,392.197z" />
                </svg>
              </button>
              <div className="hd-logo">
                <Link to="/">
                  <img
                    src="//theme.hstatic.net/1000275435/1000883829/14/logo.png"
                    alt="PATO"
                  />
                </Link>
              </div>
              <button
                className="search-mb-btn"
                onClick={() => setMobileSearchOpen((v) => !v)}
              >
                <svg width="22" viewBox="0 0 53.627 53.627" fill="currentColor">
                  <path d="M53.627,49.385L37.795,33.553C40.423,30.046,42,25.709,42,21C42,9.42,32.58,0,21,0S0,9.42,0,21s9.42,21,21,21c4.709,0,9.046-1.577,12.553-4.205l15.832,15.832L53.627,49.385z M2,21C2,10.523,10.523,2,21,2s19,8.523,19,19s-8.523,19-19,19S2,31.477,2,21z" />
                </svg>
              </button>
            </div>
          </div>
          {mobileSearchOpen && (
            <div className="mobile-search-panel">
              <div className="wrapper">
                <form onSubmit={handleSearch} className="mobile-search-form">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    placeholder="Tìm kiếm nhà hàng phù hợp"
                    autoFocus
                  />
                  <button type="submit">Tìm</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
