import { Link } from "react-router-dom";
import posthog from "posthog-js";

const PRICE_SYMBOLS = { 1: "$", 2: "$$", 3: "$$$", 4: "$$$$", 5: "$$$$$" };

export default function RestaurantCard({ restaurant }) {
  const r = restaurant;
  const priceStr = PRICE_SYMBOLS[r.price_range] || "";
  const priceRest = "$$$$$".slice(priceStr.length);

  return (
    <div className="product-item">
      <div className="product-img">
        <Link to={`/products/${r.handle}`} target="_blank">
          <img src={r.thumbnail} alt={r.title} loading="lazy" />
        </Link>
      </div>
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
              <strong>{priceStr}</strong>
              <span style={{ opacity: 0.3 }}>{priceRest}</span>
            </div>
          </div>
          {r.discount && r.discount_details && (
            <div className="textUudai">{r.discount_details}</div>
          )}
          {r.status && (
            <div className="product-type-2">
              <span className="custom_tag status-tag">{r.status}</span>
            </div>
          )}
        </div>
      {/* <div className="buy-now-product">
        <Link
          className="btn-booking"
          to={`/products/${r.handle}`}
          target="_blank"
          onClick={() =>
            posthog.capture("card_cta_click", { restaurant_handle: r.handle })
          }
        >
          Đặt chỗ ngay
        </Link>
      </div>*/}
    </div>
  );
}
