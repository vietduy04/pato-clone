import { Link } from "react-router-dom";
import posthog from "posthog-js";

// Fallback labels when description has no parseable price
const PRICE_FALLBACK = {
  1: "< 200.000 VND/người",
  2: "200.000 - 300.000 VND/người",
  3: "300.000 - 400.000 VND/người",
  4: "400.000 - 500.000 VND/người",
  5: "> 500.000 VND/người",
};

// Clean up a raw number token (remove stray spaces)
function cleanNum(s) {
  return s.trim().replace(/\s+/g, "");
}

function extractPrice(description, priceRange) {
  if (description) {
    // Strip HTML tags and markdown bold markers, collapse whitespace
    const text = description
      .replace(/<[^>]+>/g, " ")
      .replace(/\*\*/g, "")
      .replace(/\s+/g, " ");

    // Find the position of "mức giá" and work within a 150-char window after it
    const idx = text.search(/mức giá/i);
    if (idx !== -1) {
      const snippet = text.slice(idx, idx + 150);
      // Currency token (optional between nums)
      const CUR = `(?:VNĐ|VND|vnđ|vnd|đồng|đ)`;
      // Number pattern: digits/dots/commas, allowing a single stray space
      // inside the number (e.g. "1 00.000" → cleaned to "100.000")
      const NUM = `[\\d.,]+(?:\\s[\\d.,]+)*`;

      // ── "less than" patterns: dưới / chưa đến ──────────────────────────
      const lessMatch = snippet.match(
        new RegExp(`(?:dưới|chưa đến)\\s*(${NUM})`, "i")
      );
      if (lessMatch) return `< ${cleanNum(lessMatch[1])} VND/người`;

      // ── "more than" patterns: trên / hơn ───────────────────────────────
      const moreMatch = snippet.match(
        new RegExp(`(?:trên|hơn)\\s*(${NUM})`, "i")
      );
      if (moreMatch) return `> ${cleanNum(moreMatch[1])} VND/người`;

      // ── range: X [cur?] [-–/đến] X ─────────────────────────────────────
      const rangeMatch = snippet.match(
        new RegExp(`(${NUM})\\s*${CUR}?\\s*(?:[-–]|đến)\\s*(${NUM})`, "i")
      );
      if (rangeMatch)
        return `${cleanNum(rangeMatch[1])} - ${cleanNum(rangeMatch[2])} VND/người`;

      // ── single value: X cur ─────────────────────────────────────────────
      const singleMatch = snippet.match(
        new RegExp(`(${NUM})\\s*${CUR}`, "i")
      );
      if (singleMatch) return `${cleanNum(singleMatch[1])} VND/người`;
    }
  }

  // Fallback to price_range bucket
  return PRICE_FALLBACK[priceRange] || "";
}

export default function RestaurantCard({ restaurant }) {
  const r = restaurant;
  const priceLabel = extractPrice(r.description, r.price_range);

  return (
    <div className="product-item">
      <div className="product-img">
        <Link to={`/products/${r.handle}`} target="_blank">
          <img src={r.thumbnail} alt={r.title} loading="lazy" />
        </Link>
        <div className="product-item-info">
          <div className="product-title">
            <Link to={`/products/${r.handle}`} target="_blank">
              {r.title}
            </Link>
          </div>
          <div className="tag-location">{r.address}</div>
          <div className="product-detail-type">
            <div className="product-type">
              {r.cuisine_all?.slice(0, 2).map((c) => (
                <span key={c}>
                  <Link to={`/collections?cuisine=${encodeURIComponent(c)}`}>
                    {c}
                  </Link>
                </span>
              ))}
            </div>
            <div className="product-type-ver2">
              {r.service_type && (
                <span>
                  <Link
                    to={`/collections?service=${encodeURIComponent(r.service_type)}`}
                  >
                    {r.service_type}
                  </Link>
                </span>
              )}
            </div>
          </div>
          <div className="product-price">
            <div className="product-price-content">
              <strong>{priceLabel}</strong>
            </div>
          </div>
          <div className="textUudai">
            {r.discount && r.discount_details ? r.discount_details : ""}
          </div>
          <div className="product-status-row">
            {r.status && (
              <span className="custom_tag status-tag">{r.status}</span>
            )}
            <Link
              className="btn-booking"
              to={`/products/${r.handle}`}
              target="_blank"
              onClick={() =>
                posthog.capture("card_cta_click", { restaurant_handle: r.handle })
              }
            >
              Đặt ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
