import { useState, useRef, useCallback, useEffect } from 'react'
import './Carousel.css'

export default function Carousel({ items, renderItem, itemsPerView = 4, gap = 15, fixedWidth = null, autoPlay = false, autoPlayInterval = 6000, breakpoints = null }) {
  const [index, setIndex] = useState(0)
  const [itemPx, setItemPx] = useState(0)
  const [effectiveItemsPerView, setEffectiveItemsPerView] = useState(itemsPerView)
  const viewportRef = useRef(null)
  const touchStartX = useRef(null)

  useEffect(() => {
    if (!viewportRef.current) return
    const measure = () => {
      const vw = viewportRef.current.offsetWidth
      let eipv = itemsPerView
      if (breakpoints) {
        // min-width semantics (like OwlCarousel responsive): pick largest key ≤ vw
        const sorted = Object.keys(breakpoints).map(Number).sort((a, b) => b - a)
        for (const bp of sorted) {
          if (vw >= bp) { eipv = breakpoints[bp]; break }
        }
      }
      setEffectiveItemsPerView(eipv)
      setItemPx(fixedWidth ?? (vw - gap * (eipv - 1)) / eipv)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(viewportRef.current)
    return () => ro.disconnect()
  }, [fixedWidth, itemsPerView, gap, breakpoints])

  const maxIndex = Math.max(0, items.length - (fixedWidth ? 1 : effectiveItemsPerView))

  const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex(i => Math.min(maxIndex, i + 1)), [maxIndex])

  useEffect(() => {
    setIndex(i => Math.min(i, maxIndex))
  }, [maxIndex])

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev()
    touchStartX.current = null
  }, [next, prev])

  useEffect(() => {
    if (!autoPlay) return
    const id = setInterval(() => {
      setIndex(i => (i >= maxIndex ? 0 : i + 1))
    }, autoPlayInterval)
    return () => clearInterval(id)
  }, [autoPlay, autoPlayInterval, maxIndex])

  const slideStyle = itemPx
    ? { minWidth: `${itemPx}px`, maxWidth: `${itemPx}px` }
    : { minWidth: 0 }

  const trackTransform = itemPx
    ? `translateX(${-index * (itemPx + gap)}px)`
    : 'none'

  return (
    <div className="pato-carousel">
      {index > 0 && (
        <button className="carousel-btn prev" onClick={prev} aria-label="Previous">‹</button>
      )}
      <div className="carousel-viewport" ref={viewportRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div
          className="carousel-track"
          style={{ transform: trackTransform, gap: `${gap}px` }}
        >
          {items.map((item, i) => (
            <div key={i} className="carousel-slide" style={slideStyle}>
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
