import { useParams, Link } from 'react-router-dom'

const PAGES = {
  'gioi-thieu': {
    title: 'Giới thiệu',
    content: 'PATO là kênh thông tin và đặt bàn nhà hàng hàng đầu Việt Nam. Chúng tôi kết nối thực khách với hàng nghìn nhà hàng trên toàn quốc, giúp bạn dễ dàng tìm kiếm và đặt bàn nhanh chóng, miễn phí.',
  },
  'lien-he': {
    title: 'Liên hệ hợp tác',
    content: 'Để hợp tác với PATO, vui lòng liên hệ:\nHotline: 1900.2280\nEmail: pato.com.vn@gmail.com\nĐịa chỉ: Tầng 9, Detech Tower 2, Số 107 Nguyễn Phong Sắc, Phường Cầu Giấy, Hà Nội.',
  },
}

export default function StaticPage() {
  const { handle } = useParams()
  const page = PAGES[handle]

  return (
    <div style={{ padding: '40px 0', minHeight: '60vh' }}>
      <div className="wrapper">
        <div className="product-breadcrumb" style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>
          <Link to="/" style={{ color: 'var(--brand)' }}>Trang chủ</Link>
          <span> / </span>
          <span>{page?.title || handle}</span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, textTransform: 'uppercase', marginBottom: 20 }}>
          {page?.title || handle}
        </h1>
        {page?.content ? (
          page.content.split('\n').map((line, i) => (
            <p key={i} style={{ fontSize: 14, lineHeight: '1.8', marginBottom: 10 }}>{line}</p>
          ))
        ) : (
          <p style={{ color: '#666' }}>Nội dung trang đang được cập nhật.</p>
        )}
      </div>
    </div>
  )
}
