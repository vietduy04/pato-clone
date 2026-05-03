import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import './BlogPostPage.css'

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

// Strips leading heading markers (##, ###, etc.)
function stripHeadingMarkers(md) {
  return md.replace(/^#{1,6}\s*/, '')
}

// Extracts image src from markdown image syntax
function extractImgSrc(md) {
  const m = md.match(/!\[[^\]]*\]\(([^)]+)\)/)
  return m ? m[1] : null
}

// Normalises a protocol-relative URL to https
function normaliseUrl(url) {
  if (!url) return url
  return url.startsWith('//') ? `https:${url}` : url
}

// Parses inline markdown into React elements.
// Handles: ***bold italic***, **bold**, *italic*, [text](url)
function parseInline(text, keyPrefix) {
  const parts = []
  // Order matters: bold-italic before bold before italic
  const regex = /\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let idx = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index))
    }

    const key = `${keyPrefix}-${idx}`

    if (match[1] !== undefined) {
      // ***bold italic***
      parts.push(<strong key={key}><em>{parseInline(match[1], `${key}bi`)}</em></strong>)
    } else if (match[2] !== undefined) {
      // **bold**
      parts.push(<strong key={key}>{parseInline(match[2], `${key}b`)}</strong>)
    } else if (match[3] !== undefined) {
      // *italic*
      parts.push(<em key={key}>{parseInline(match[3], `${key}i`)}</em>)
    } else if (match[4] !== undefined) {
      // [text](url)
      const href = match[5]
      const label = match[4]
      const isExternal = href.startsWith('http') || href.startsWith('//')
      if (isExternal) {
        parts.push(
          <a key={key} href={href} target="_blank" rel="noreferrer noopener">
            {label}
          </a>
        )
      } else if (href.startsWith('tel:') || href.startsWith('tel: ')) {
        const tel = href.replace('tel: ', 'tel:').replace(/\s/g, '')
        parts.push(<a key={key} href={tel}>{label}</a>)
      } else {
        // Internal link — treat as product handle
        parts.push(<Link key={key} to={`/products/${href}`}>{label}</Link>)
      }
    }

    last = regex.lastIndex
    idx++
  }

  if (last < text.length) {
    parts.push(text.slice(last))
  }

  return parts
}

function renderBlock(block, i) {
  if (block.type === 'image') {
    const src = normaliseUrl(block.src || extractImgSrc(block.markdown))
    if (!src) return null
    return (
      <figure key={i} className="blog-figure">
        <img src={src} alt="" loading="lazy" />
      </figure>
    )
  }

  if (block.type === 'heading') {
    const text = stripHeadingMarkers(block.markdown)
    const Tag = block.level === 3 ? 'h3' : 'h2'
    return (
      <Tag key={i} className={`blog-heading blog-h${block.level}`}>
        {parseInline(text, `h${i}`)}
      </Tag>
    )
  }

  if (block.type === 'paragraph') {
    // Skip bare image markdown — image blocks cover these
    if (/^!\[/.test(block.markdown.trim())) return null
    const alignClass = block.align === 'center' ? ' center' : ''
    return (
      <p key={i} className={`blog-paragraph${alignClass}`}>
        {parseInline(block.markdown, `p${i}`)}
      </p>
    )
  }

  return null
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    setPost(null)
    fetch(`/data/blog_data/${slug}.json`)
      .then(r => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then(data => { setPost(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [slug])

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Blog', href: '/blogs' },
    { label: post?.title || '...' },
  ]

  if (loading) {
    return (
      <div className="blog-post-page">
        <div className="wrapper">
          <div className="blog-post-skeleton-title" />
          <div className="blog-post-skeleton-body">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="blog-post-skeleton-line" style={{ width: `${75 + (i % 3) * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="blog-post-page">
        <div className="wrapper">
          <p className="blog-post-error">Không tìm thấy bài viết này.</p>
          <Link to="/blogs" className="blog-post-back">← Quay lại Blog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-post-page">
      <div className="wrapper">
        <Breadcrumb items={breadcrumbItems} />
        <article className="blog-post-article">
          <header className="blog-post-header">
            <h1 className="blog-post-title">{post.title}</h1>
            <div className="blog-post-meta">
              <span className="blog-post-date">{post.date}</span>
            </div>
          </header>
          <div className="blog-post-body">
            {post.blocks.map((block, i) => renderBlock(block, i))}
          </div>
          <div className="blog-post-footer">
            <Link to="/blogs" className="blog-post-back">← Quay lại Blog</Link>
          </div>
        </article>
      </div>
    </div>
  )
}
