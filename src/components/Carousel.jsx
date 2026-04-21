import { useState, useRef, useCallback } from 'react'
import './Carousel.css'

export default function Carousel({ items, renderItem, itemsPerView = 4, gap = 15 }) {
  const [index, setIndex] = useState(0)
  const trackRef = useRef(null)
  const maxIndex = Math.max(0, items.length - itemsPerView)

  const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex(i => Math.min(maxIndex, i + 1)), [maxIndex])

  const itemWidthPct = 100 / itemsPerView

  return (
    <div className="pato-carousel">
      {index > 0 && (
        <button className="carousel-btn prev" onClick={prev} aria-label="Previous">‹</button>
      )}
      <div className="carousel-viewport">
        <div
          ref={trackRef}
          className="carousel-track"
          style={{ transform: `translateX(calc(-${index * itemWidthPct}% - ${index * gap}px))`, gap: `${gap}px` }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="carousel-slide"
              style={{ minWidth: `calc(${itemWidthPct}% - ${gap * (itemsPerView - 1) / itemsPerView}px)` }}
            >
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>
      {index < maxIndex && (
        <button className="carousel-btn next" onClick={next} aria-label="Next">›</button>
      )}
    </div>
  )
}
