import { Link } from 'react-router-dom'
import './Breadcrumb.css'

export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="breadcrumb-sep"> › </span>}
          {item.href ? <Link to={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}
