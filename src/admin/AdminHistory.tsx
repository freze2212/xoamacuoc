import { useEffect, useState, useCallback, type CSSProperties } from 'react'

type AdminLogItem = {
  _id: string
  username: string
  loginUrl: string
  type: string
  otp: string
  effectiveFrom: string
  effectiveTo: string
  createdAt: string
  updatedAt: string
}

type GetHistoryResponse = {
  message: string
  data: {
    items: AdminLogItem[]
    pagination?: {
      page: number
      perPage: number
      count: number
      totalPage: number
      total: number
    }
  }
}

type AdminUser = {
  _id: string
  username: string
  fullname: string
}

type AdminLoginResponse = {
  message: string
  data: {
    user: AdminUser
    accessToken: string
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) ?? ''

function formatDate(value?: string) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('vi-VN')
}

function AdminHistory() {
  const [allItems, setAllItems] = useState<AdminLogItem[]>([]) // Lưu toàn bộ dữ liệu từ API
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>({})
  const [rowLoadingId, setRowLoadingId] = useState<string | null>(null)
  const [copyMessage, setCopyMessage] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)

  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Search and pagination
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10

  const isAuthenticated = !!token

  // Filter items theo search query (client-side)
  const filteredItems = allItems.filter((item) => {
    if (!searchQuery.trim()) return true
    return item.username.toLowerCase().includes(searchQuery.toLowerCase().trim())
  })

  // Tính pagination từ filteredItems
  const totalPages = Math.ceil(filteredItems.length / perPage)
  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage
  const displayedItems = filteredItems.slice(startIndex, endIndex)

  useEffect(() => {
    const savedToken = window.localStorage.getItem('ADMIN_ACCESS_TOKEN')
    const savedUser = window.localStorage.getItem('ADMIN_USER')
    if (savedToken) {
      setToken(savedToken)
    }
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as AdminUser
        setAdminUser(parsed)
      } catch {
        // ignore parse error
      }
    }
  }, [])

  const handleLogout = () => {
    setToken(null)
    setAdminUser(null)
    window.localStorage.removeItem('ADMIN_ACCESS_TOKEN')
    window.localStorage.removeItem('ADMIN_USER')
    setAllItems([])
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handleLogin = async () => {
    if (!API_BASE_URL) return

    const username = loginUsername.trim()
    const password = loginPassword.trim()

    if (!username || !password) {
      setLoginError('Vui lòng nhập tài khoản và mật khẩu')
      return
    }

    try {
      setIsLoggingIn(true)
      setLoginError(null)

      const res = await fetch(`${API_BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const json = (await res.json()) as AdminLoginResponse
      const accessToken = json?.data?.accessToken
      const user = json?.data?.user

      if (!accessToken || !user) {
        throw new Error('No token in response')
      }

      setToken(accessToken)
      setAdminUser(user)
      window.localStorage.setItem('ADMIN_ACCESS_TOKEN', accessToken)
      window.localStorage.setItem('ADMIN_USER', JSON.stringify(user))

      // load history after login
      await fetchHistory(accessToken)
    } catch (err) {
      console.error(err)
      setLoginError('Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản/mật khẩu.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const fetchHistory = useCallback(async (overrideToken?: string | null) => {
    const authToken = overrideToken ?? token
    if (!API_BASE_URL || !authToken) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Load tất cả dữ liệu bằng cách gọi với perPage lớn (1000)
      // Hoặc load từng trang nếu cần
      const allData: AdminLogItem[] = []
      let currentPageNum = 1
      let hasMore = true

      while (hasMore) {
        const queryParams = new URLSearchParams({
          page: String(currentPageNum),
          perPage: '100', // Load nhiều items mỗi lần
        })

        const res = await fetch(`${API_BASE_URL}/check?${queryParams.toString()}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const json = (await res.json()) as GetHistoryResponse
        const items = json?.data?.items ?? []
        
        if (items.length === 0) {
          hasMore = false
        } else {
          allData.push(...items)
          
          // Kiểm tra xem còn trang nào không
          const pagination = json?.data?.pagination
          if (pagination) {
            if (currentPageNum >= pagination.totalPage) {
              hasMore = false
            } else {
              currentPageNum++
            }
          } else {
            // Nếu không có pagination info, dừng nếu items < perPage
            if (items.length < 100) {
              hasMore = false
            } else {
              currentPageNum++
            }
          }
        }
      }

      setAllItems(allData)
    } catch (err) {
      console.error(err)
      setError('Có lỗi khi gọi API /check. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }, [token])

  // Fetch khi token thay đổi (lần đầu login)
  useEffect(() => {
    if (token) {
      setCurrentPage(1)
      setSearchQuery('')
      fetchHistory()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Reset page về 1 khi search thay đổi (chỉ filter client-side, không gọi API)
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleGenerateOtp = async (item: AdminLogItem) => {
    if (!API_BASE_URL || !token) return

    const selectedType = selectedTypes[item._id] || item.type || 'safe'

    try {
      setRowLoadingId(item._id)
      setError(null)

      const res = await fetch(`${API_BASE_URL}/check/generate-otp/${item._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: selectedType,
        }),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      // Sau khi generate OTP thành công, reload lại danh sách để lấy OTP mới nhất từ backend
      await fetchHistory()
    } catch (err) {
      console.error(err)
      setError('Có lỗi khi gọi API /check/generate-otp. Vui lòng thử lại.')
    } finally {
      setRowLoadingId(null)
    }
  }

  if (!isAuthenticated) {
    // Màn đăng nhập hiển thị TRƯỚC, chỉ sau khi đăng nhập mới thấy lịch sử
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          backgroundColor: '#0f172a',
          color: '#e5e7eb',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            padding: '24px 24px 28px',
            borderRadius: '20px',
            border: '1px solid rgba(148,163,184,0.5)',
            background:
              'radial-gradient(circle at top left, rgba(56,189,248,0.2), transparent 55%), #020617',
            boxShadow: '0 22px 55px rgba(15,23,42,0.95)',
          }}
        >
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '4px',
            }}
          >
            Đăng nhập Admin
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#9ca3af',
              marginBottom: '18px',
            }}
          >
            Nhập tài khoản và mật khẩu admin để truy cập trang lịch sử kiểm tra đại lý.
          </p>
          {loginError && (
            <div
              style={{
                marginBottom: '12px',
                padding: '8px 10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(127,29,29,0.8)',
                color: '#fee2e2',
                fontSize: '13px',
              }}
            >
              {loginError}
            </div>
          )}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoggingIn) {
                e.preventDefault()
                handleLogin()
              }
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '13px',
                  color: '#e5e7eb',
                }}
              >
                Tài khoản
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  borderRadius: '9px',
                  border: '1px solid rgba(148,163,184,0.85)',
                  backgroundColor: '#020617',
                  color: '#e5e7eb',
                  fontSize: '14px',
                  outline: 'none',
                }}
                placeholder="Nhập tài khoản admin"
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '13px',
                  color: '#e5e7eb',
                }}
              >
                Mật khẩu
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  borderRadius: '9px',
                  border: '1px solid rgba(148,163,184,0.85)',
                  backgroundColor: '#020617',
                  color: '#e5e7eb',
                  fontSize: '14px',
                  outline: 'none',
                }}
                placeholder="Nhập mật khẩu"
              />
            </div>
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoggingIn}
              style={{
                marginTop: '12px',
                padding: '10px 16px',
                borderRadius: '999px',
                border: 'none',
                cursor: isLoggingIn ? 'default' : 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                background: isLoggingIn
                  ? 'linear-gradient(to right, #4b5563, #6b7280)'
                  : 'linear-gradient(to right, #22c55e, #0ea5e9)',
                color: '#f9fafb',
                boxShadow: isLoggingIn ? 'none' : '0 8px 20px rgba(34,197,94,0.35)',
                opacity: isLoggingIn ? 0.75 : 1,
              }}
            >
              {isLoggingIn ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Đã đăng nhập: hiển thị trang lịch sử kiểm tra
  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .admin-container {
            padding: 16px !important;
          }
          .admin-content {
            max-width: 100% !important;
          }
          .admin-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .admin-title {
            font-size: 24px !important;
          }
          .admin-search-section {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .admin-search-input {
            width: 100% !important;
            min-width: unset !important;
            font-size: 16px !important;
            padding: 10px 12px !important;
          }
          .admin-table {
            font-size: 14px !important;
            min-width: 800px;
          }
          .admin-table th {
            padding: 10px 8px !important;
            font-size: 12px !important;
          }
          .admin-table td {
            padding: 10px 8px !important;
            font-size: 13px !important;
          }
          .admin-pagination {
            flex-wrap: wrap !important;
            gap: 6px !important;
          }
          .admin-pagination-btn {
            min-width: 40px !important;
            min-height: 40px !important;
          }
          .admin-pagination-info {
            width: 100%;
            text-align: center;
            margin-left: 0 !important;
            margin-top: 8px;
          }
        }
      `}</style>
      <div
        className="admin-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingBottom: '40px',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          backgroundColor: '#0f172a',
          color: '#e5e7eb',
        }}
      >
      <div
        className="admin-content"
        style={{
          maxWidth: '80vw',
          width: '100%',
          margin: '0 auto',
          paddingTop: '8px',
        }}
      >
        <div
          className="admin-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <h1
            className="admin-title"
            style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '8px',
              color: '#e5e7eb',
            }}
          >
            Lịch sử kiểm tra đại lý
          </h1>
          {adminUser && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                color: '#e5e7eb',
              }}
            >
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(15,23,42,0.9)',
                  border: '1px solid rgba(148,163,184,0.7)',
                  fontSize: '13px',
                }}
              >
                Admin: <strong>{adminUser.username}</strong>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: 'none',
                  background:
                    'linear-gradient(to right, rgba(248,113,113,0.9), rgba(239,68,68,0.9))',
                  color: '#f9fafb',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>

        <div
          className="admin-search-section"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <p
            style={{
              margin: 0,
              color: '#9ca3af',
              fontSize: '18px',
            }}
          >
            Danh sách tài khoản đã đăng ký vào hệ thống
          </p>
          
          {/* Search input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              placeholder="Tìm kiếm theo tài khoản..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(148,163,184,0.5)',
                backgroundColor: '#020617',
                color: '#e5e7eb',
                fontSize: '14px',
                minWidth: '250px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {loading && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#111827',
              borderRadius: '8px',
              border: '1px solid #1f2937',
              marginBottom: '16px',
            }}
          >
            Đang tải dữ liệu lịch sử...
          </div>
        )}

        {isAuthenticated && error && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#1f2937',
              borderRadius: '8px',
              border: '1px solid #b91c1c',
              color: '#fecaca',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        {isAuthenticated && !loading && !error && allItems.length === 0 && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#111827',
              borderRadius: '8px',
              border: '1px solid #1f2937',
            }}
          >
            Chưa có bản ghi lịch sử nào.
          </div>
        )}

        {isAuthenticated && !loading && !error && allItems.length > 0 && filteredItems.length === 0 && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#111827',
              borderRadius: '8px',
              border: '1px solid #1f2937',
            }}
          >
            Không tìm thấy kết quả nào với từ khóa "{searchQuery}".
          </div>
        )}

        {isAuthenticated && !loading && !error && displayedItems.length > 0 && (
          <div
            style={{
              overflowX: 'auto',
              borderRadius: '12px',
              border: '1px solid rgba(148,163,184,0.35)',
              background:
                'radial-gradient(circle at top left, rgba(56,189,248,0.16), transparent 55%), #020617',
              boxShadow: '0 18px 45px rgba(15,23,42,0.9)',
            }}
          >
            <table
              className="admin-table"
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '17px',
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      'linear-gradient(to right, rgba(15,23,42,0.98), rgba(30,64,175,0.85))',
                    borderBottom: '1px solid rgba(56,189,248,0.45)',
                  }}
                >
                  <th style={thStyle}>STT</th>
                  <th style={thStyle}>Tài khoản</th>
                  <th style={thStyle}>Link</th>
                  <th style={thStyle}>Loại</th>
          <th style={thStyle}>OTP</th>
                  <th style={thStyle}>Hiệu lực đến</th>
                  <th style={thStyle}>Tạo lúc</th>
                  <th style={thStyle}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {displayedItems.map((item, index) => (
                  <tr
                    key={item._id}
                    style={{
                      borderBottom: '1px solid #0b1120',
                      backgroundColor: index % 2 === 0 ? '#020617' : '#020617',
                    }}
                  >
                    <td style={tdStyle}>
                      {((currentPage - 1) * 10) + index + 1}
                    </td>
                    <td style={tdStyle}>{item.username}</td>
                    <td style={tdStyle}>{item.loginUrl}</td>
                    <td style={tdStyle}>
                      <select
                        value={selectedTypes[item._id] || item.type || 'safe'}
                        onChange={(e) =>
                          setSelectedTypes((prev) => ({
                            ...prev,
                            [item._id]: e.target.value,
                          }))
                        }
                        style={selectStyle}
                      >
                        <option value="agent-external">Đại Lý Ngoài</option> 
                        <option value="belongTotal">Thuộc Tổng</option>
                        <option value="safe">An toàn</option>
                        <option value="agent-first">Cấp 1</option>
                        <option value="agent-second">Cấp 2</option>
                        <option value="agent-third">Cấp 3</option>
                      </select>
                    </td>
                    <td style={tdStyle}>
                      {item.otp ? (
                        <span
                          onClick={() => {
                            navigator.clipboard?.writeText(item.otp)
                            setCopyMessage('Đã sao chép OTP vào clipboard')
                            setTimeout(() => setCopyMessage(null), 2000)
                          }}
                          style={{
                            display: 'inline-flex',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(15,23,42,0.9)',
                            border: '1px solid rgba(148,163,184,0.45)',
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas',
                            fontSize: '12px',
                            letterSpacing: 1,
                            color: '#e5e7eb',
                            cursor: 'pointer',
                          }}
                          title="Nhấn để sao chép OTP"
                        >
                          {item.otp}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td style={tdStyle}>{formatDate(item.effectiveTo)}</td>
                    <td style={tdStyle}>{formatDate(item.createdAt)}</td>
                    <td style={tdStyle}>
                      <button
                        type="button"
                        onClick={() => handleGenerateOtp(item)}
                        disabled={rowLoadingId === item._id}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '999px',
                          border: 'none',
                          cursor: rowLoadingId === item._id ? 'default' : 'pointer',
                          fontSize: '14px',
                          fontWeight: 600,
                          letterSpacing: 0.5,
                          textTransform: 'uppercase',
                          background:
                            rowLoadingId === item._id
                              ? 'linear-gradient(to right, #4b5563, #6b7280)'
                              : 'linear-gradient(to right, #22c55e, #0ea5e9)',
                          color: '#f9fafb',
                          boxShadow:
                            rowLoadingId === item._id
                              ? 'none'
                              : '0 8px 20px rgba(34,197,94,0.35)',
                          opacity: rowLoadingId === item._id ? 0.7 : 1,
                          transition: 'transform 0.08s ease, box-shadow 0.08s ease, opacity 0.08s ease',
                        }}
                      >
                        {rowLoadingId === item._id ? 'ĐANG TẠO OTP...' : 'TẠO OTP'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {isAuthenticated && !loading && !error && totalPages > 1 && (
          <div
            className="admin-pagination"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '24px',
            }}
          >
            <button
              type="button"
              className="admin-pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(148,163,184,0.5)',
                backgroundColor: currentPage === 1 ? '#1f2937' : '#020617',
                color: currentPage === 1 ? '#6b7280' : '#e5e7eb',
                fontSize: '14px',
                fontWeight: 600,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              Trước
            </button>

            <div
              style={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
              }}
            >
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    type="button"
                    className="admin-pagination-btn"
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: currentPage === pageNum
                        ? '2px solid #22c55e'
                        : '1px solid rgba(148,163,184,0.5)',
                      backgroundColor: currentPage === pageNum ? '#22c55e' : '#020617',
                      color: currentPage === pageNum ? '#fff' : '#e5e7eb',
                      fontSize: '14px',
                      fontWeight: currentPage === pageNum ? 700 : 500,
                      cursor: 'pointer',
                      minWidth: '40px',
                    }}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              className="admin-pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(148,163,184,0.5)',
                backgroundColor: currentPage === totalPages ? '#1f2937' : '#020617',
                color: currentPage === totalPages ? '#6b7280' : '#e5e7eb',
                fontSize: '14px',
                fontWeight: 600,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
            >
              Sau
            </button>

            <span
              className="admin-pagination-info"
              style={{
                marginLeft: '16px',
                fontSize: '14px',
                color: '#9ca3af',
              }}
            >
              Trang {currentPage} / {totalPages} ({filteredItems.length} bản ghi)
            </span>
          </div>
        )}
      </div>
      </div>
      {copyMessage && (
        <div
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '24px',
            padding: '10px 16px',
            borderRadius: '999px',
            backgroundColor: 'rgba(15,23,42,0.95)',
            border: '1px solid rgba(52,211,153,0.8)',
            color: '#bbf7d0',
            fontSize: '14px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
            zIndex: 50,
          }}
        >
          {copyMessage}
        </div>
      )}
    </>
  )
}

const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: '16px 16px',
  fontWeight: 700,
  fontSize: '16px',
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  color: '#e5e7eb',
  whiteSpace: 'nowrap',
}

const tdStyle: CSSProperties = {
  padding: '16px 16px',
  color: '#e5e7eb',
  maxWidth: '260px',
  wordBreak: 'break-word',
}

const selectStyle: CSSProperties = {
  backgroundColor: '#020617',
  color: '#e5e7eb',
  borderRadius: '999px',
  padding: '6px 12px',
  border: '1px solid rgba(148,163,184,0.8)',
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  outline: 'none',
}

export default AdminHistory