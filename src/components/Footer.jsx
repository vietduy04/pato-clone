import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer id="footer">
      <div className="footer-content">
        <div className="wrapper">
          <div className="inner">
            <div className="footer-grid">
              {/* Col 1: Contact */}
              <div className="ft-col ft-contact">
                <h3 className="ft-title">Thông tin liên hệ</h3>
                <div className="ft-contact-item">
                  <span className="ft-icon">
                    <svg width="18" viewBox="0 0 512 512" fill="currentColor">
                      <path d="m256 0c-140.609375 0-256 115.390625-256 256 0 46.40625 12.511719 91.582031 36.238281 131.105469l-36.238281 124.894531 124.894531-36.238281c39.523438 23.726562 84.699219 36.238281 131.105469 36.238281 140.609375 0 256-115.390625 256-256s-115.390625-256-256-256zm160.054688 364.167969-11.910157 11.910156c-16.851562 16.851563-55.605469 15.515625-80.507812 10.707031-82.800781-15.992187-179.335938-109.5625-197.953125-190.59375-9.21875-40.140625-4.128906-75.039062 9.183594-88.355468l11.910156-11.910157c6.574218-6.570312 17.253906-6.5625 23.820312 0l47.648438 47.652344c3.179687 3.179687 4.921875 7.394531 4.921875 11.90625s-1.742188 8.730469-4.921875 11.898437l-11.90625 11.921876c-13.125 13.15625-13.125 34.527343 0 47.652343l78.683594 77.648438c13.164062 13.164062 34.46875 13.179687 47.652343 0l11.910157-11.90625c6.148437-6.183594 17.632812-6.203125 23.832031 0l47.636719 47.636719c6.46875 6.441406 6.714843 17.113281 0 23.832031z" />
                    </svg>
                  </span>
                  <div>
                    Hotline: <a href="tel:19002280">1900.2280</a> -{" "}
                    <a href="tel:0859201132">0859201132</a>
                    <br />
                    <small>Cước phí 2.000đ/phút, hoạt động 24/7</small>
                  </div>
                </div>
                <div className="ft-contact-item">
                  <span className="ft-icon">✉</span>
                  <div>
                    Email:{" "}
                    <a href="mailto:pato.com.vn@gmail.com">
                      pato.com.vn@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Col 2: About */}
              <div className="ft-col ft-nav">
                <h3 className="ft-title">Về Pato</h3>
                <ul>
                  <li>
                    <span className="ft-caret">›</span>{" "}
                    <Link to="/pages/gioi-thieu">Giới thiệu</Link>
                  </li>
                  <li>
                    <span className="ft-caret">›</span>{" "}
                    <Link to="/pages/lien-he">Liên hệ hợp tác</Link>
                  </li>
                  <li>
                    <span className="ft-caret">›</span>{" "}
                    <Link to="/pages/de-an-cung-cap-dich-vu-thuong-mai-dien-tu">
                      Đề án cung cấp dịch vụ TMĐT
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3: Terms */}
              <div className="ft-col ft-nav">
                <h3 className="ft-title">Điều khoản sử dụng</h3>
                <ul>
                  <li>
                    <span className="ft-caret">›</span>{" "}
                    <Link to="/pages/chinh-sach">Quy chế hoạt động</Link>
                  </li>
                  <li>
                    <span className="ft-caret">›</span>{" "}
                    <Link to="/pages/dieu-khoan-voi-doi-tac">
                      Điều khoản với Đối tác
                    </Link>
                  </li>
                  <li>
                    <span className="ft-caret">›</span>{" "}
                    <Link to="/pages/chinh-sach-bao-ve-thong-tin-ca-nhan-cua-nguoi-tieu-dung">
                      Chính sách bảo mật thông tin
                    </Link>
                  </li>
                  <li>
                    <span className="ft-caret">›</span>{" "}
                    <Link to="/pages/co-che-giai-quyet-tranh-chap">
                      Cơ chế giải quyết tranh chấp
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 4: Social */}
              <div className="ft-col ft-social-col">
                <h3 className="ft-title">Kết nối với chúng tôi</h3>
                <p>Liên hệ ngay! Chúng tôi luôn sẵn sàng hỗ trợ 24/7</p>
                <div className="ft-social-icons">
                  <a
                    href="https://www.facebook.com/pato.com.vn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="//theme.hstatic.net/1000275435/1000883829/14/ft_col_4_icon1.png"
                      alt="Facebook"
                    />
                  </a>
                  <a
                    href="https://zalo.me/4122875064715593998"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="//theme.hstatic.net/1000275435/1000883829/14/ft_col_4_icon2.png"
                      alt="Zalo"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-copyrights">
        <div className="wrapper">
          <div className="ft-copy-content">
            <div>
              <strong>THÔNG TIN DOANH NGHIỆP</strong>
              <br />
              Mã số thuế: 0109488219
              <br />
              Người chịu trách nhiệm nội dung: La Ngọc Phương Trinh
              <br />
              Hotline: 1900.2280 | Email: pato.com.vn@gmail.com
              <br />
              Địa chỉ: Tầng 9, Detech Tower 2, Số 107 Nguyễn Phong Sắc, Phường
              Cầu Giấy, Thành phố Hà Nội.
              <br />© 2024 – Bản quyền thuộc Công ty TNHH Joyhub Việt Nam.
            </div>
            <div className="ft-bct-logo">
              <a
                href="http://online.gov.vn/Website/chi-tiet-134162"
                target="_blank"
                rel="nofollow noreferrer"
              >
                <img
                  src="//theme.hstatic.net/1000275435/1000883829/14/logo_bct_hihi.png"
                  alt="Bộ Công Thương"
                  width="150"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
