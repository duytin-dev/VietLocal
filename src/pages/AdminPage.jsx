import { useCallback, useEffect, useRef, useState } from 'react';
import { isProductionApi } from '../api/config';
import { Link } from 'react-router-dom';
import { adminApi, clearAdminSecret, getAdminSecret, setAdminSecret } from '../api/adminClient';
import { formatVnd } from '../utils/format';
import './AdminPage.css';

const TABS = [
  { id: 'dashboard', label: 'Tổng quan', icon: '📊' },
  { id: 'bookings', label: 'Đặt chuyến đi', icon: '🧳' },
  { id: 'guides', label: 'Hướng dẫn viên', icon: '🧭' },
  { id: 'users', label: 'Người dùng', icon: '👤' },
  { id: 'ai', label: 'Tương tác AI', icon: '🤖' },
];

const GUIDE_TIER_VI = {
  PREMIUM: 'Cao cấp',
  MID: 'Trung bình',
  BUDGET: 'Tiết kiệm',
};

const EMPTY_GUIDE_FORM = {
  name: '',
  slug: '',
  tier: 'MID',
  pricePerDay: '',
  rating: '5',
  languages: 'Tiếng Việt',
  imageUrl: '',
  bio: '',
  styleDescription: '',
};

const BOOKING_STATUS_VI = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

const PAYMENT_STATUS_VI = {
  PENDING: 'Chưa thanh toán',
  PAID: 'Đã thanh toán',
  FAILED: 'Thất bại',
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('vi-VN');
}

function StatusBadge({ value, type }) {
  if (!value) return <span className="admin-badge admin-badge--muted">—</span>;
  const label =
    type === 'payment' ? PAYMENT_STATUS_VI[value] || value : BOOKING_STATUS_VI[value] || value;
  const cls =
    value === 'PAID' || value === 'CONFIRMED' || value === 'COMPLETED'
      ? 'admin-badge--ok'
      : value === 'PENDING'
        ? 'admin-badge--warn'
        : value === 'CANCELLED' || value === 'FAILED'
          ? 'admin-badge--bad'
          : 'admin-badge--muted';
  return <span className={`admin-badge ${cls}`}>{label}</span>;
}

function StatCard({ label, value, hint, accent }) {
  return (
    <article className={`admin-stat${accent ? ` admin-stat--${accent}` : ''}`}>
      <p className="admin-stat__label">{label}</p>
      <p className="admin-stat__value">{value}</p>
      {hint && <p className="admin-stat__hint">{hint}</p>}
    </article>
  );
}

function Pager({ page, data, onPageChange }) {
  if (!data || data.totalPages <= 1) return null;
  return (
    <footer className="admin-pager">
      <button
        type="button"
        disabled={page <= 0}
        onClick={() => onPageChange(page - 1)}
        className="vl-btn vl-btn--outline vl-btn--sm"
      >
        Trước
      </button>
      <span>
        Trang {page + 1} / {data.totalPages} ({data.totalElements} bản ghi)
      </span>
      <button
        type="button"
        disabled={page >= data.totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        className="vl-btn vl-btn--outline vl-btn--sm"
      >
        Sau
      </button>
    </footer>
  );
}

export default function AdminPage() {
  const [secret, setSecret] = useState(getAdminSecret());
  const [inputSecret, setInputSecret] = useState('');
  const [tab, setTab] = useState('dashboard');
  const [page, setPage] = useState(0);
  const [dashboard, setDashboard] = useState(null);
  const [data, setData] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [guideForm, setGuideForm] = useState(EMPTY_GUIDE_FORM);
  const [showGuideForm, setShowGuideForm] = useState(false);
  const loadingRef = useRef(false);

  const loadDashboard = useCallback(async () => {
    const stats = await adminApi.getDashboard();
    setDashboard(stats);
  }, []);

  const loadList = useCallback(async () => {
    if (tab === 'dashboard') {
      await loadDashboard();
      setData(null);
      return;
    }
    let result;
    if (tab === 'bookings') result = await adminApi.listBookings(page, 20);
    else if (tab === 'users') result = await adminApi.listUsers(page, 20);
    else if (tab === 'guides') result = await adminApi.listGuides(page, 20);
    else result = await adminApi.listAiChats(page, 20);
    setData(result);
  }, [tab, page, loadDashboard]);

  const load = useCallback(async () => {
    if (!getAdminSecret() || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError('');
    try {
      await loadList();
    } catch (e) {
      setError(e.message || 'Không tải được dữ liệu');
      if (e.code === 'UNAUTHORIZED') {
        clearAdminSecret();
        setSecret('');
        setInputSecret('');
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [loadList]);

  useEffect(() => {
    if (secret) load();
  }, [secret, load]);

  const handleLogin = (e) => {
    e.preventDefault();
    setAdminSecret(inputSecret.trim());
    setSecret(inputSecret.trim());
    setPage(0);
    setTab('dashboard');
  };

  const handleLogout = () => {
    clearAdminSecret();
    setSecret('');
    setDashboard(null);
    setData(null);
    setSelectedBooking(null);
  };

  const switchTab = (id) => {
    setTab(id);
    setPage(0);
    setSelectedBooking(null);
    setSuccess('');
    setError('');
  };

  const handleGuideField = (field, value) => {
    setGuideForm((f) => ({ ...f, [field]: value }));
  };

  const handleCreateGuide = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const body = {
        name: guideForm.name.trim(),
        tier: guideForm.tier,
        pricePerDay: Number(guideForm.pricePerDay),
        rating: Number(guideForm.rating),
        languages: guideForm.languages.trim() || undefined,
      };
      if (guideForm.slug.trim()) body.slug = guideForm.slug.trim();
      if (guideForm.imageUrl.trim()) body.imageUrl = guideForm.imageUrl.trim();
      if (guideForm.bio.trim()) body.bio = guideForm.bio.trim();
      if (guideForm.styleDescription.trim()) body.styleDescription = guideForm.styleDescription.trim();

      const created = await adminApi.createGuide(body);
      setSuccess(`Đã thêm HDV "${created.name}" (slug: ${created.slug})`);
      setGuideForm(EMPTY_GUIDE_FORM);
      setShowGuideForm(false);
      setTab('guides');
      setPage(0);
      await loadList();
    } catch (err) {
      setError(err.message || 'Không tạo được hướng dẫn viên');
    } finally {
      setLoading(false);
    }
  };

  if (!secret) {
    return (
      <article className="admin-page admin-page--login">
        <section className="admin-login-card">
          <div className="admin-login-card__brand">
            <span className="admin-login-card__logo">VL</span>
            <h1>VivuDi Admin</h1>
          </div>
          <p>Quản lý đặt tour, người dùng và tương tác AI</p>
          <form onSubmit={handleLogin}>
            <label>
              Mã admin (X-Admin-Secret)
              <input
                type="password"
                value={inputSecret}
                onChange={(e) => setInputSecret(e.target.value)}
                placeholder="vietlocal-admin-dev"
                autoComplete="off"
              />
            </label>
            <button type="submit" className="vl-btn vl-btn--primary vl-btn--block">
              Đăng nhập
            </button>
          </form>
          <p className="admin-login-hint">
            {isProductionApi() ? (
              <>
                Production: copy giá trị <strong>ADMIN_SECRET</strong> từ Render → Web Service →
                Environment (không dùng <code>vietlocal-admin-dev</code>).
              </>
            ) : (
              <>
                Dev local: <code>vietlocal-admin-dev</code>
              </>
            )}
          </p>
          <Link to="/">← Về trang chủ</Link>
        </section>
      </article>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <img src="/logo-vivudi.png" alt="VivuDi" className="admin-sidebar__logo-img" />
          <div>
            <strong>VivuDi</strong>
            <small>Admin</small>
          </div>
        </div>
        <nav className="admin-sidebar__nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? 'active' : ''}
              onClick={() => switchTab(t.id)}
            >
              <span aria-hidden>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__foot">
          <Link to="/" className="admin-sidebar__link">
            ← Trang chủ
          </Link>
          <button type="button" onClick={handleLogout} className="admin-sidebar__logout">
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-main__head">
          <div>
            <h1>{TABS.find((t) => t.id === tab)?.label}</h1>
            <p>
              {tab === 'dashboard' && 'Thống kê tổng hợp hệ thống'}
              {tab === 'bookings' && 'Danh sách đơn đặt tour từ khách'}
              {tab === 'guides' && 'Thêm và quản lý hướng dẫn viên'}
              {tab === 'users' && 'Tài khoản đã đăng ký'}
              {tab === 'ai' && 'Lịch sử chat AI Planner'}
            </p>
          </div>
          <button type="button" className="vl-btn vl-btn--outline vl-btn--sm" onClick={load}>
            Làm mới
          </button>
        </header>

        {error && <p className="admin-error">{error}</p>}
        {success && <p className="admin-success">{success}</p>}
        {loading && <p className="admin-loading">Đang tải...</p>}

        {!loading && tab === 'dashboard' && dashboard && (
          <section className="admin-dashboard">
            <div className="admin-stats">
              <StatCard label="Đơn đặt tour" value={dashboard.totalBookings} accent="primary" />
              <StatCard
                label="Đã thanh toán"
                value={dashboard.paidBookings}
                hint={`${dashboard.pendingPaymentBookings} chờ thanh toán`}
                accent="ok"
              />
              <StatCard label="Doanh thu" value={formatVnd(dashboard.totalRevenue)} accent="revenue" />
              <StatCard label="Người dùng" value={dashboard.totalUsers} />
              <StatCard label="Chat AI" value={dashboard.totalAiChats} />
              <StatCard label="Hướng dẫn viên" value={dashboard.totalGuides} />
            </div>
            <section className="admin-panel admin-panel--hint">
              <h2>Bắt đầu nhanh</h2>
              <ul>
                <li>
                  <button type="button" onClick={() => switchTab('bookings')}>
                    Xem đơn đặt chuyến →
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => switchTab('users')}>
                    Xem người dùng đăng ký →
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => switchTab('ai')}>
                    Xem tương tác AI →
                  </button>
                </li>
              </ul>
            </section>
          </section>
        )}

        {!loading && data && tab === 'bookings' && (
          <>
            <section className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Chuyến đi</th>
                    <th>Khách hàng</th>
                    <th>HDV</th>
                    <th>Tổng tiền</th>
                    <th>Thanh toán</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="admin-empty">
                        Chưa có đơn đặt nào
                      </td>
                    </tr>
                  ) : (
                    data.content.map((b) => (
                      <tr
                        key={b.id}
                        className={selectedBooking?.id === b.id ? 'admin-table__row--active' : ''}
                        onClick={() => setSelectedBooking(b)}
                      >
                        <td>#{b.id}</td>
                        <td>
                          <strong>{b.tripTitle || '—'}</strong>
                          {b.destinationName && (
                            <small className="admin-table__sub">{b.destinationName}</small>
                          )}
                        </td>
                        <td>
                          <strong>{b.customerName}</strong>
                          <small className="admin-table__sub">{b.email}</small>
                          {b.userFullName && (
                            <small className="admin-table__account">TK: {b.userFullName}</small>
                          )}
                        </td>
                        <td>
                          {b.guideName || '—'}
                          <small className="admin-table__sub">{b.estimatedDays} ngày</small>
                        </td>
                        <td className="admin-table__money">{formatVnd(b.totalAmount)}</td>
                        <td>
                          <StatusBadge value={b.paymentStatus} type="payment" />
                        </td>
                        <td>{formatDate(b.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
            {selectedBooking && (
              <aside className="admin-detail">
                <header>
                  <h2>Chi tiết đơn #{selectedBooking.id}</h2>
                  <button type="button" onClick={() => setSelectedBooking(null)} aria-label="Đóng">
                    ×
                  </button>
                </header>
                <dl className="admin-detail__list">
                  <dt>Chuyến đi</dt>
                  <dd>{selectedBooking.tripTitle || '—'}</dd>
                  <dt>Điểm đến</dt>
                  <dd>{selectedBooking.destinationName || '—'}</dd>
                  <dt>Khách đặt</dt>
                  <dd>
                    {selectedBooking.customerName}
                    <br />
                    {selectedBooking.email}
                    {selectedBooking.phone && (
                      <>
                        <br />
                        {selectedBooking.phone}
                      </>
                    )}
                  </dd>
                  {selectedBooking.userFullName && (
                    <>
                      <dt>Tài khoản</dt>
                      <dd>{selectedBooking.userFullName}</dd>
                    </>
                  )}
                  <dt>HDV</dt>
                  <dd>{selectedBooking.guideName || '—'}</dd>
                  <dt>Số ngày</dt>
                  <dd>{selectedBooking.estimatedDays}</dd>
                  <dt>Tổng tiền</dt>
                  <dd className="admin-detail__money">{formatVnd(selectedBooking.totalAmount)}</dd>
                  <dt>Trạng thái đơn</dt>
                  <dd>
                    <StatusBadge value={selectedBooking.status} />
                  </dd>
                  <dt>Thanh toán</dt>
                  <dd>
                    <StatusBadge value={selectedBooking.paymentStatus} type="payment" />
                    {selectedBooking.transactionRef && (
                      <small> Mã: {selectedBooking.transactionRef}</small>
                    )}
                  </dd>
                  {selectedBooking.itinerarySummary && (
                    <>
                      <dt>Lịch trình</dt>
                      <dd>{selectedBooking.itinerarySummary}</dd>
                    </>
                  )}
                  {selectedBooking.customerNotes && (
                    <>
                      <dt>Ghi chú</dt>
                      <dd>{selectedBooking.customerNotes}</dd>
                    </>
                  )}
                  <dt>Thời gian</dt>
                  <dd>{formatDate(selectedBooking.createdAt)}</dd>
                </dl>
              </aside>
            )}
            <Pager page={page} data={data} onPageChange={setPage} />
          </>
        )}

        {!loading && tab === 'guides' && (
          <>
            <section className="admin-panel admin-panel--actions">
              <button
                type="button"
                className="vl-btn vl-btn--primary vl-btn--sm"
                onClick={() => setShowGuideForm((v) => !v)}
              >
                {showGuideForm ? 'Đóng form' : '+ Thêm hướng dẫn viên'}
              </button>
            </section>

            {showGuideForm && (
              <section className="admin-panel admin-guide-form">
                <h2>Thêm hướng dẫn viên mới</h2>
                <form onSubmit={handleCreateGuide} className="admin-guide-form__grid">
                  <label>
                    Họ tên *
                    <input
                      required
                      value={guideForm.name}
                      onChange={(e) => handleGuideField('name', e.target.value)}
                      placeholder="Nguyễn Văn A"
                    />
                  </label>
                  <label>
                    Slug (tùy chọn)
                    <input
                      value={guideForm.slug}
                      onChange={(e) => handleGuideField('slug', e.target.value)}
                      placeholder="nguyen-van-a — để trống tự tạo"
                    />
                  </label>
                  <label>
                    Hạng *
                    <select
                      value={guideForm.tier}
                      onChange={(e) => handleGuideField('tier', e.target.value)}
                    >
                      <option value="PREMIUM">Cao cấp (PREMIUM)</option>
                      <option value="MID">Trung bình (MID)</option>
                      <option value="BUDGET">Tiết kiệm (BUDGET)</option>
                    </select>
                  </label>
                  <label>
                    Giá / ngày (VNĐ) *
                    <input
                      type="number"
                      required
                      min="1"
                      step="1000"
                      value={guideForm.pricePerDay}
                      onChange={(e) => handleGuideField('pricePerDay', e.target.value)}
                      placeholder="800000"
                    />
                  </label>
                  <label>
                    Đánh giá (0–5)
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={guideForm.rating}
                      onChange={(e) => handleGuideField('rating', e.target.value)}
                    />
                  </label>
                  <label>
                    Ngôn ngữ
                    <input
                      value={guideForm.languages}
                      onChange={(e) => handleGuideField('languages', e.target.value)}
                      placeholder="Tiếng Việt, English"
                    />
                  </label>
                  <label className="admin-guide-form__full">
                    URL ảnh
                    <input
                      value={guideForm.imageUrl}
                      onChange={(e) => handleGuideField('imageUrl', e.target.value)}
                      placeholder="https://..."
                    />
                  </label>
                  <label className="admin-guide-form__full">
                    Giới thiệu
                    <textarea
                      rows={2}
                      value={guideForm.bio}
                      onChange={(e) => handleGuideField('bio', e.target.value)}
                    />
                  </label>
                  <label className="admin-guide-form__full">
                    Phong cách
                    <textarea
                      rows={2}
                      value={guideForm.styleDescription}
                      onChange={(e) => handleGuideField('styleDescription', e.target.value)}
                    />
                  </label>
                  <motion.div className="admin-guide-form__actions admin-guide-form__full">
                    <button type="submit" className="vl-btn vl-btn--primary" disabled={loading}>
                      Lưu HDV
                    </button>
                  </motion.div>
                </form>
              </section>
            )}

            {data && (
              <>
                <section className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Hạng</th>
                        <th>Giá/ngày</th>
                        <th>Đánh giá</th>
                        <th>Ngôn ngữ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.content.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="admin-empty">
                            Chưa có hướng dẫn viên
                          </td>
                        </tr>
                      ) : (
                        data.content.map((g) => (
                          <tr key={g.id}>
                            <td>#{g.id}</td>
                            <td>
                              <strong>{g.name}</strong>
                              <small className="admin-table__sub">{g.slug}</small>
                            </td>
                            <td>
                              <span className="admin-badge admin-badge--muted">
                                {GUIDE_TIER_VI[g.tier] || g.tier}
                              </span>
                            </td>
                            <td className="admin-table__money">{formatVnd(g.pricePerDay)}</td>
                            <td>{g.rating}</td>
                            <td>{g.languages || '—'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </section>
                <Pager page={page} data={data} onPageChange={setPage} />
              </>
            )}
          </>
        )}

        {!loading && data && tab === 'users' && (
          <>
            <section className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Số đơn đặt</th>
                    <th>Đăng ký</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="admin-empty">
                        Chưa có người dùng
                      </td>
                    </tr>
                  ) : (
                    data.content.map((u) => (
                      <tr key={u.id}>
                        <td>#{u.id}</td>
                        <td>
                          <strong>{u.fullName}</strong>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className="admin-badge admin-badge--muted">{u.role}</span>
                        </td>
                        <td>{u.bookingCount}</td>
                        <td>{formatDate(u.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
            <Pager page={page} data={data} onPageChange={setPage} />
          </>
        )}

        {!loading && data && tab === 'ai' && (
          <>
            <section className="admin-ai-list">
              {data.content.length === 0 ? (
                <p className="admin-empty admin-empty--block">Chưa có tương tác AI</p>
              ) : (
                data.content.map((log) => (
                  <article key={log.id} className="admin-ai-card">
                    <header>
                      <span className="admin-ai-card__session">{log.sessionId}</span>
                      <time>{formatDate(log.createdAt)}</time>
                    </header>
                    <div className="admin-ai-card__msg admin-ai-card__msg--user">
                      <strong>Khách</strong>
                      <p>{log.userMessage}</p>
                    </div>
                    <div className="admin-ai-card__msg admin-ai-card__msg--ai">
                      <strong>AI</strong>
                      <p>{log.aiReply}</p>
                    </div>
                    {log.suggestedItinerary && (
                      <pre className="admin-ai-card__itinerary">{log.suggestedItinerary}</pre>
                    )}
                    {log.suggestedGuideIds?.length > 0 && (
                      <p className="admin-ai-card__guides">
                        HDV gợi ý: {log.suggestedGuideIds.join(', ')}
                      </p>
                    )}
                  </article>
                ))
              )}
            </section>
            <Pager page={page} data={data} onPageChange={setPage} />
          </>
        )}
      </main>
    </div>
  );
}

