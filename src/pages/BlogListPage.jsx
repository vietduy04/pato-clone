import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import './BlogListPage.css'

const PAGE_SIZE = 10

const COLLECTION_LABELS = {
  healthy: 'Healthy',
  'huong-dan': 'Hướng dẫn',
  'doi-tac': 'Đối tác',
  'top-nha-hang': 'Top nhà hàng',
  'mon-heo': 'Món heo',
  'van-hoa-viet-nam': 'Văn hóa Việt Nam',
  'mon-nhau': 'Món nhậu',
  'mon-chay': 'Món chay',
  'am-thuc-a-au': 'Ẩm thực Á - Âu',
  'am-thuc-3-mien': 'Ẩm thực 3 miền',
  'hai-san': 'Hải sản',
  'rau-cu': 'Rau củ',
  'mon-ga': 'Món gà',
  'trang-mieng': 'Tráng miệng',
  'mon-bo': 'Món bò',
  'an-vat': 'Ăn vặt',
  'do-uong': 'Đồ uống',
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  if (!y || !m || !d) return dateStr
  return `${d}/${m}/${y}`
}

function buildPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = []
  pages.push(1)
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}

function BlogCard({ post }) {
  return (
    <Link to={`/blogs/${post.slug}`} className="blog-card">
      <div className="blog-card-img">
        <img src={post.cover_image} alt={post.title} loading="lazy" />
      </div>
      <div className="blog-card-body">
        {post.collection && COLLECTION_LABELS[post.collection] && (
          <span className="blog-card-collection">
            {COLLECTION_LABELS[post.collection]}
          </span>
        )}
        <h3 className="blog-card-title">{post.title}</h3>
        <span className="blog-card-date">{formatDate(post.date)}</span>
      </div>
    </Link>
  )
}

export default function BlogListPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  const collection = searchParams.get('collection') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/blog_index.json`)
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!collection) return posts
    return posts.filter(p => p.collection === collection)
  }, [posts, collection])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function setCollection(col) {
    const p = new URLSearchParams()
    if (col) p.set('collection', col)
    setSearchParams(p)
  }

  function goToPage(n) {
    const p = new URLSearchParams(searchParams)
    if (n === 1) p.delete('page')
    else p.set('page', String(n))
    setSearchParams(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Blog' },
  ]

  return (
    <div className="blog-list-page">
      <div className="wrapper">
        <Breadcrumb items={breadcrumbItems} />
        <div className="blog-inner">
          <aside className="blog-sidebar">
            <div className="filter-section">
              <h3>Chuyên mục</h3>
              <div className="blog-category-list">
                <button
                  className={`blog-category-btn${!collection ? ' active' : ''}`}
                  onClick={() => setCollection('')}
                >
                  Tất cả
                </button>
                {Object.entries(COLLECTION_LABELS).map(([slug, label]) => (
                  <button
                    key={slug}
                    className={`blog-category-btn${collection === slug ? ' active' : ''}`}
                    onClick={() => setCollection(slug)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="blog-content">
            <div className="blog-content-header">
              <span className="result-count">
                {loading ? 'Đang tải...' : `Có ${filtered.length} bài viết`}
              </span>
            </div>

            {loading ? (
              <div className="blog-grid">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="blog-card-skeleton" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="blog-empty">
                <p>Không tìm thấy bài viết nào.</p>
              </div>
            ) : (
              <>
                <div className="blog-grid">
                  {pageItems.map(post => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ‹
                    </button>
                    {buildPageNumbers(currentPage, totalPages).map((n, i) =>
                      n === '...' ? (
                        <span key={`e-${i}`} className="pagination-ellipsis">…</span>
                      ) : (
                        <button
                          key={n}
                          className={`pagination-btn${n === currentPage ? ' active' : ''}`}
                          onClick={() => goToPage(n)}
                        >
                          {n}
                        </button>
                      )
                    )}
                    <button
                      className="pagination-btn"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
