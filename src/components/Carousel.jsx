import { useState, useRef, useCallback, useEffect } from 'react'
import './Carousel.css'

export default function Carousel({ items, renderItem, itemsPerView = 4, gap = 15, fixedWidth = null, autoPlay = false, autoPlayInterval = 6000 }) {
  const [index, setIndex] = useState(0)
  const trackRef = useRef(null)
  const maxIndex = Math.max(0, items.length - (fixedWidth ? 1 : itemsPerView))

  const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex(i => Math.min(maxIndex, i + 1)), [maxIndex])

  useEffect(() => {
    if (!autoPlay) return
    const id = setInterval(() => {
      setIndex(i => (i >= maxIndex ? 0 : i + 1))
    }, autoPlayInterval)
    return () => clearInterval(id)
  }, [autoPlay, autoPlayInterval, maxIndex])

  const slideStyle = fixedWidth
    ? { minWidth: `${fixedWidth}px`, maxWidth: `${fixedWidth}px` }
    : { minWidth: `calc(${100 / itemsPerView}% - ${gap * (itemsPerView - 1) / itemsPerView}px)` }

  const trackTransform = fixedWidth
    ? `translateX(calc(-${index} * (${fixedWidth}px + ${gap}px)))`
    : `translateX(calc(-${index * (100 / itemsPerView)}% - ${index * gap}px))`

  return (
    <div className="pato-carousel">
      {index > 0 && (
        <button className="carousel-btn prev" onClick={prev} aria-label="Previous">‹</button>
      )}
      <div className="carousel-viewport">
        <div
          ref={trackRef}
          className="carousel-track"
          style={{ transform: trackTransform, gap: `${gap}px` }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="carousel-slide"
              style={slideStyle}
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
