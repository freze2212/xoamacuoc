import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AppPro.css";

type CheckType =
  | "safe"
  | "agent-first"
  | "agent-second"
  | "agent-third"
  | "agent-external"
  | "belongTotal"
  | string;

type CheckResponse = {
  username: string;
  loginUrl: string;
  type?: CheckType;
};

function App() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [account, setAccount] = useState("");
  const [link, setLink] = useState("");
  const [errors, setErrors] = useState({ account: false, link: false });
  const [linkErrorType] = useState<"empty" | "invalid">("empty");
  const [checkResult, setCheckResult] = useState<CheckResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"link" | "select">("link");
  const [showCasinoModal, setShowCasinoModal] = useState(false);
  const [casinoSearch, setCasinoSearch] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const SAFE_CASINOS = ["XX88", "MM88", "GG88", "RR88"];

  const casinos = [
    "XX88",
    "MM88",
    "GG88",
    "J88",
    "AE888",
    "WW88",
    "FUN88",
    "MU88",
    "MB66",
    "CM88",
    "FLY88",
    "8KBET",
    "RR88",
    "JUN88",
    "78WIN",
    "BL555",
    "AU88",
    "DF999",
    "789BET",
    "HI88",
    "SHBET",
    "F8BET",
    "QQ88",
    "NEW88",
    "KUBET",
    "LUCKY88",
    "go88",
    "sunwin",
    "ok9",
    "f168",
    "gk88",
    "6623",
    "s8",
    "u888",
    "sodo",
    "OK8386",
    "C168",
    "OPEN88",
    "SC88",
  ];

  const filteredCasinos = casinos.filter((casino) =>
    casino.toLowerCase().includes(casinoSearch.toLowerCase())
  );

  const getResultPillText = () => {
    const type = (checkResult?.type ?? "safe").toLowerCase();
    if (type === "agent-first") return "TÀI KHOẢN DÍNH MÃ ĐẠI LÍ CẤP 1";
    if (type === "agent-second") return "TÀI KHOẢN DÍNH MÃ ĐẠI LÍ CẤP 2";
    if (type === "agent-third") return "TÀI KHOẢN DÍNH MÃ ĐẠI LÍ CẤP 3";
    if (type === "agent-external") return "TÀI KHOẢN DÍNH MÃ ĐẠI LÍ NGOÀI";
    if (type === "belongTotal") return "TÀI KHOẢN THUỘC TỔNG";
    return "TÀI KHOẢN AN TOÀN";
  };

  const isAgentType = () => {
    const type = (checkResult?.type ?? "safe").toLowerCase();
    return (
      type === "agent-first" ||
      type === "agent-second" ||
      type === "agent-third" ||
      type === "agent-external"
    );
  };

  const isValidUrl = (string: string): boolean => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      const trimmed = string.trim();
      return trimmed.startsWith("http://") || trimmed.startsWith("https://");
    }
  };

  const handleCheck = () => {
    if (isChecking) return;

    const hasAccount = account.trim() !== "";
    const hasLink = link.trim() !== "";

    // Nếu đang ở chế độ nhập link (tự do), check hợp lệ link
    const isLinkValid = inputMode === "link" ? isValidUrl(link.trim()) : true;

    if (!hasAccount || !hasLink || !isLinkValid) {
      let message = "";
      if (!hasAccount) {
        message = "Vui lòng nhập tài khoản game";
      } else if (!hasLink) {
        message = "Vui lòng nhập link nhà cái";
      } else if (inputMode === "link" && !isLinkValid) {
        message = "Vui lòng nhập link hợp lệ (http:// hoặc https://)";
      }
      setErrorMessage(message);
      setShowErrorPopup(true);
      return;
    }

    setErrors({ account: false, link: false });
    setCheckResult(null);
    setApiError(null);
    setIsChecking(true);
    setShowResult(false);
    setProgress(0);

    // BẮT ĐẦU CHẠY PROGRESS, khi chạy xong 100% mới show kết quả
  };

  // Xử lý hiệu ứng thanh progress "đang kiểm tra"
  useEffect(() => {
    if (!isChecking) return;

    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 7, 100);
        if (next === 100) {
          clearInterval(interval);

          // Khi hoàn tất, tự động xử lý kết quả dựa vào sảnh được chọn
          setTimeout(() => {
            // Xác định loại checkResult dựa trên link/sảnh
            let type: CheckType = "safe";
            if (
              inputMode === "select" &&
              SAFE_CASINOS.includes(link.trim())
            ) {
              type = "safe";
            } else {
              // Nếu không phải 1 trong 4 sảnh thì báo dính mã đại lý ngoài
              type = "agent-external";
            }
            setCheckResult({
              username: account.trim(),
              loginUrl: link.trim(),
              type,
            });
            setIsChecking(false);
            setShowResult(true);
          }, 350); // Đợi một chút cho hiệu ứng mượt
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [isChecking]);

  const handleCloseResult = () => {
    setShowResult(false);
  };

  const handleConfirmResult = () => {
    setShowResult(false);
    navigate("/delete-code");
  };

  return (
    <main className="app-container">
      {/* Full-screen glow overlay */}
      <div className="glow-overlay"></div>
      <div className="scanline"></div>
      <div className="edge-ring left"></div>
      <div className="edge-ring right"></div>

      {/* Floating particles - full screen coverage */}
      <div className="particle p1"></div>
      <div className="particle p2"></div>
      <div className="particle p3"></div>
      <div className="particle p4"></div>
      <div className="particle p5"></div>
      <div className="particle p6"></div>
      <div className="particle p7"></div>
      <div className="particle p8"></div>
      <div className="particle p9"></div>
      <div className="particle p10"></div>

      {/* Geometric shapes - full screen coverage */}
      <div className="shape triangle"></div>
      <div className="shape circle"></div>
      <div className="shape square"></div>
      <div className="shape triangle"></div>
      <div className="shape circle"></div>
      <div className="shape square"></div>

      <div className="title-image-wrapper">
        <img src="/title.webp" alt="Phần mềm quét mã nguồn đại lý" />
      </div>
      <div className="app-content">
        <div className="app-body-layout">
          <div className="body-side body-side-left">
            <img className="body-side-image" src="/ae-sexy.png" alt="" />
          </div>
          {/* Modal Form */}
          <div className="modal">
            {/* Background Image */}
            <div className="modal-bg-image-mb">
              <img src="/bg-modal-mb.webp" alt="background" />
            </div>
            <div className="modal-bg-image"></div>
            {/* Form Content */}
            <div className="modal-form">
              <div className="modal-heading-badge">CHECK MÃ ẨN</div>
              <div className="formGroupWrapper">
                {/* Input 1: Tài khoản game */}
                <div
                  className={`form-group ${
                    errors.account ? "form-group-error" : ""
                  }`}
                >
                  <div className="form-label-row">
                    <label className="form-label">Tài khoản game</label>
                  </div>
                  <div className="input-wrapper input-wrapper-select">
                    <input
                      type="text"
                      className={`form-input ${
                        errors.account ? "form-input--error" : ""
                      }`}
                      placeholder={
                        errors.account
                          ? "Vui lòng nhập tài khoản"
                          : "Nhập tài khoản game"
                      }
                      value={account}
                      onChange={(e) => {
                        const value = e.target.value;
                        setAccount(value);
                        if (errors.account && value.trim() !== "") {
                          setErrors((prev) => ({ ...prev, account: false }));
                        }
                      }}
                    />
                  </div>
                </div>
                {/* Input 2: Link nhà cái */}
                <div
                  className={`form-group ${errors.link ? "form-group-error" : ""}`}
                >
                  <div className="form-label-row">
                    <label className="form-label">Link nhà cái</label>
                  </div>

                  {/* Toggle switch */}
                  <div className="input-mode-toggle-wrapper">
                    <div className="input-mode-toggle">
                      <button
                        type="button"
                        className={`toggle-btn ${inputMode === "link" ? "active" : ""}`}
                        onClick={() => {
                          setInputMode("link");
                          setLink("");
                        }}
                      >
                        Nhập Link
                      </button>
                      <button
                        type="button"
                        className={`toggle-btn ${inputMode === "select" ? "active" : ""}`}
                        onClick={() => {
                          setInputMode("select");
                          setLink("");
                        }}
                      >
                        Chọn nhà cái
                      </button>
                    </div>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      className={`form-input ${
                        errors.link ? "form-input--error" : ""
                      }`}
                      placeholder={
                        inputMode === "link"
                          ? errors.link && linkErrorType === "invalid"
                            ? "Nhập link hợp lệ (http:// hoặc https://)"
                            : errors.link
                              ? "Vui lòng nhập link nhà cái"
                              : "Nhập link nhà cái"
                          : "Chọn nhà cái"
                      }
                      value={link}
                      readOnly
                      onChange={() => {}}
                      onClick={() => {
                        setInputMode("select");
                        setShowCasinoModal(true);
                      }}
                    />
                    <button
                      type="button"
                      className="select-inline-button"
                      onClick={() => {
                        setInputMode("select");
                        setShowCasinoModal(true);
                      }}
                    >
                      Chọn
                    </button>
                  </div>
                </div>
                {/* Button với hiệu ứng sóng */}
                <div className="checkingWrapper">
                  {isChecking ? (
                    <button
                      className="form-button form-button-checking"
                      onClick={handleCheck}
                      disabled={isChecking}
                    >
                      <span className="form-button-label ">
                        ĐANG KIỂM TRA... {Math.round(progress)}%
                      </span>
                    </button>
                  ) : (
                    <button
                      className="form-button-checking btn-check"
                      onClick={handleCheck}
                      disabled={isChecking}
                    >
                      tiến hành kiểm tra
                    </button>
                  )}
                </div>
                {/* Social Icons */}
                <div className="social-icons">
                  {/* Telegram Icon */}
                  <a
                    href="https://t.me/CONGBINH2026"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-tele"
                  >
                    <img src="/tele-icon.webp" alt="" className="icon-tele" />
                    <span className="social-text">Telegram hỗ trợ</span>
                  </a>
                  {/* Facebook Icon */}
                  <a
                    href="https://www.facebook.com/profile.php?id=61551351983672"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-fb"
                  >
                    <img src="/fb-icon.webp" alt="Facebook" className="icon-fb" />
                    <span className="social-text">Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="body-side body-side-right">
            <img className="body-side-image body-side-image-dg" src="/dg.png" alt="" />
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && (
        <div className="result-overlay" onClick={handleCloseResult}>
          <div
            className={`result-modal ${isAgentType() ? "result-modal-danger scary-modal shake" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={isAgentType()
              ? { boxShadow: "0 4px 40px 0 #ff4444, 0 1.5px 12px #560000 inset" }
              : {}
            }
          >
            <div className={`result-icon-circle ${isAgentType() ? "scary-icon jump" : ""}`}>
              <img
                src={isAgentType() ? "/danger.png" : "/done.png"}
                alt="Đã check xong"
                className={`result-icon-image ${isAgentType() ? "flash-red" : ""}`}
              />
            </div>
            <div
              className={`result-text-top ${isAgentType() ? "scary-text shake-text" : ""}`}
              style={isAgentType() ? { color: "#ff2222", fontWeight: 900 } : {}}
            >
              ĐÃ CHECK XONG
            </div>
            {isAgentType() && (
              <div
                className="result-danger-alert scary-alert flash-bg"
                style={{
                  color: "#ff5555",
                  background: "rgba(255,42,32,0.15)",
                  borderRadius: 12,
                  margin: "14px 0 10px 0",
                  padding: "10px 14px",
                  fontWeight: 700,
                  fontSize: "1.12rem",
                  border: "2px solid #fc1919",
                  boxShadow: "0 0 18px 2px #ff2222b0"
                }}
              >
                <span role="img" aria-label="warning" style={{ fontSize: 32, verticalAlign: "middle", marginRight: 12 }}>⚠️</span>
                <b style={{ color: "#fff", fontWeight: 900 }}>{link.trim() || "N/A"}</b> đang bị <span style={{ color: "#fc1919", fontWeight: 900 }}>THEO DÕI NGHIÊM NGẶT</span> vì hoạt động & trụ sở tại <span style={{ textDecoration: "underline", color: "#fff", fontWeight: 900 }}>Campuchia</span>.<br />
                <span className="scary-blink" style={{ color: "#fff", fontWeight: 900, fontSize: "1.18rem", letterSpacing: "1px" }}>⛔ KHẨN CẤP: HÃY CHUYỂN SẢNH NGAY! ⛔</span>
              </div>
            )}
            {/* CSS animations for effects */}
            <style>
              {`
                .scary-modal.shake {
                  animation: shake-it 0.6s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes shake-it {
                  0% {transform:translateX(0);}
                  15% {transform:translateX(-16px);}
                  30% {transform:translateX(14px);}
                  45% {transform:translateX(-10px);}
                  60% {transform:translateX(6px);}
                  75% {transform:translateX(-3px);}
                  100% {transform:translateX(0);}
                }
                .scary-icon.jump {
                  animation: scary-jump 0.9s cubic-bezier(.75, -0.03, .2, 1.1) infinite alternate;
                }
                @keyframes scary-jump {
                  0% { transform: scale(1) translateY(0);}
                  35% {transform: scale(1.15) translateY(-9px);}
                  100% {transform: scale(1.02) translateY(0);}
                }
                .flash-red {
                  animation: flashRedImage 0.16s alternate infinite;
                }
                @keyframes flashRedImage {
                  from { filter: drop-shadow(0 0 0 #ff1744);}
                  to { filter: drop-shadow(0 0 16px #fc1919) saturate(1.7);}
                }
                .flash-bg {
                  animation: scaryBG 0.4s alternate infinite;
                }
                @keyframes scaryBG {
                  from { background: rgba(255,42,32,0.13);}
                  to { background: rgba(255,42,32,0.22);}
                }
                .scary-text.shake-text {
                  animation: scaryTextShake 0.8s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes scaryTextShake {
                  0% {letter-spacing: 0;}
                  33% {letter-spacing: 2px;}
                  67% {letter-spacing: 5px;}
                  100% {letter-spacing: 0;}
                }
                .scary-blink {
                  animation: blinkWarning 0.75s steps(2) infinite;
                }
                @keyframes blinkWarning {
                  0% {opacity:1;}
                  60% {opacity:0.5;}
                  100% {opacity:1;}
                }
              `}
            </style>
            {apiError && <div className="result-error-text">{apiError}</div>}
            {checkResult && !apiError && (
              <>
                <div
                  className={`result-pill ${isAgentType() ? "result-pill-danger" : ""}`}
                >
                  <span className="result-pill-text">
                    {getResultPillText()}
                  </span>
                </div>
              </>
            )}
            <button
              className={`result-close-button ${isAgentType() ? "result-close-button-danger" : ""}`}
              onClick={handleConfirmResult}
            >
              {isAgentType() ? "VUI LÒNG HUỶ" : "ĐÓNG"}
            </button>
          </div>
        </div>
      )}

      {/* Casino Selection Modal */}
      {showCasinoModal && (
        <div
          className="casino-modal-overlay"
          onClick={() => setShowCasinoModal(false)}
        >
          <div
            className="casino-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="casino-modal-header">
              <h2 className="casino-modal-title">Chọn nhà cái</h2>
              <button
                className="casino-modal-close"
                onClick={() => setShowCasinoModal(false)}
              >
                ×
              </button>
            </div>

            <div className="casino-search-wrapper">
              <input
                type="text"
                className="casino-search-input"
                placeholder="Tìm kiếm nhà cái..."
                value={casinoSearch}
                onChange={(e) => setCasinoSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div className="casino-list">
              {filteredCasinos.length > 0 ? (
                filteredCasinos.map((casino) => (
                  <button
                    key={casino}
                    type="button"
                    className="casino-item"
                    onClick={() => {
                      setLink(casino);
                      setShowCasinoModal(false);
                      setCasinoSearch("");
                      if (errors.link) {
                        setErrors((prev) => ({ ...prev, link: false }));
                      }
                    }}
                  >
                    {casino}
                  </button>
                ))
              ) : (
                <div className="casino-no-results">Không tìm thấy nhà cái</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div
          className="error-popup-overlay"
          onClick={() => setShowErrorPopup(false)}
        >
          <div className="error-popup" onClick={(e) => e.stopPropagation()}>
            <div className="error-popup-content">
              <div className="error-popup-icon">!</div>
              <div className="error-popup-message">{errorMessage}</div>
              <button
                className="error-popup-button"
                onClick={() => setShowErrorPopup(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
export default App;
