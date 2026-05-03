import { useState, useEffect } from "react";
import posthog from "posthog-js";
import "./BookingModal.css";

const TIMES = Array.from({ length: 96 }, (_, i) => {
  const h = String(Math.floor(i / 4)).padStart(2, "0");
  const m = String((i % 4) * 15).padStart(2, "0");
  return `${h}:${m}`;
});

const PEOPLE = Array.from({ length: 100 }, (_, i) => `${i + 1} người`);

export default function BookingModal({ restaurant, onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    adults: "",
    children: "",
    note: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  useEffect(() => {
    posthog.capture("booking_modal_open", {
      restaurant_handle: restaurant?.handle,
      restaurant_name: restaurant?.title,
    });
  }, []);

  if (!restaurant) return null;

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    const endpoint = "https://script.google.com/macros/s/AKfycbzCkgaaeIgK9Xcb83MI4XIFUaSyT24q0zO3ZMpmq8W74D9irluzXTn840t8SyquFVUG/exec";

    const payload = {
      restaurant: restaurant.title,
      address: restaurant.address ?? "",
      name: form.name,
      phone: form.phone,
      date: form.date,
      time: form.time,
      adults: form.adults,
      children: form.children || "0",
      note: form.note,
      submittedAt: new Date().toISOString(),
    };

    try {
      await fetch(endpoint, {
        method: "POST",
        // Apps Script Web Apps require no-cors when called from a browser
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // no-cors means response is opaque — assume success if no throw
      setStatus("success");
      posthog.capture("booking_submitted", {
        restaurant_handle: restaurant.handle,
        restaurant_name: restaurant.title,
        date: form.date,
        time: form.time,
        adults: form.adults,
        children: form.children || "0",
        has_note: form.note.length > 0,
      });
    } catch {
      setStatus("error");
      posthog.capture("booking_error", {
        restaurant_handle: restaurant.handle,
        restaurant_name: restaurant.title,
      });
    }
  };

  return (
    <div className="booking-overlay" onClick={onClose}>
      <div
        className="booking-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="booking-close" onClick={onClose} aria-label="Đóng">
          ×
        </button>

        {status === "success" ? (
          <div className="booking-success">
            <div className="booking-success-icon">✓</div>
            <h2>Đặt bàn thành công!</h2>
            <p>
              Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận
              đặt chỗ.
            </p>
            <button className="btn-booking-submit" onClick={onClose}>
              Đóng
            </button>
          </div>
        ) : (
          <form className="booking-form" onSubmit={handleSubmit} noValidate>
            <h2 className="booking-title">THÔNG TIN ĐẶT BÀN</h2>
            <p className="booking-restaurant-name">{restaurant.title}</p>

            <div className="booking-fields">
              <input
                className="booking-input"
                type="text"
                placeholder="Tên *"
                value={form.name}
                onChange={set("name")}
                required
              />
              <input
                className="booking-input"
                type="tel"
                placeholder="Số điện thoại *"
                value={form.phone}
                onChange={set("phone")}
                required
              />
              <input
                className="booking-input"
                type="date"
                placeholder="Ngày *"
                value={form.date}
                onChange={set("date")}
                required
                min={new Date().toISOString().split("T")[0]}
              />
              <select
                className="booking-select"
                value={form.time}
                onChange={set("time")}
                required
              >
                <option value="">Chọn giờ *</option>
                {TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                className="booking-select"
                value={form.adults}
                onChange={set("adults")}
                required
              >
                <option value="">Số người lớn *</option>
                {PEOPLE.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <select
                className="booking-select"
                value={form.children}
                onChange={set("children")}
              >
                <option value="">Số trẻ em</option>
                {PEOPLE.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <textarea
                className="booking-textarea"
                placeholder="Ghi chú thêm..."
                rows={3}
                value={form.note}
                onChange={set("note")}
              />
            </div>

            {status === "error" && (
              <p className="booking-error">
                Có lỗi xảy ra. Vui lòng thử lại hoặc gọi{" "}
                <a href="tel:19002280">1900.2280</a>.
              </p>
            )}

            <button
              className="btn-booking-submit"
              type="submit"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Đang gửi..." : "Đặt ngay"}
            </button>

            <div className="booking-footer">
              <p>
                Hoặc gọi tới:{" "}
                <a href="tel:19002280" className="booking-phone">
                  1900.2280
                </a>
                <br />
                Để đặt chỗ và được tư vấn.
              </p>
              <p className="booking-privacy">
                Mọi thông tin khách hàng cung cấp chỉ được sử dụng cho mục đích
                đặt bàn, hoàn toàn không dùng cho bất kỳ mục đích nào khác.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
