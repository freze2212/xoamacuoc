import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./delete-code-pro.css";
import { InfoRow, Panel } from "./components";
import { deleteCodeTheme } from "./theme";

const REGION_COUNTRY_POOLS = [
  {
    tech: "CỔNG NGẪU NHIÊN TÂY Á",
    countries: ["INDIA", "PAKISTAN", "BANGLADESH", "SRI LANKA"],
  },
  {
    tech: "CỔNG NGẪU NHIÊN ĐÔNG NAM Á",
    countries: ["SINGAPORE", "THAILAND", "MALAYSIA", "INDONESIA", "VIETNAM"],
  },
  {
    tech: "CỔNG NGẪU NHIÊN CHÂU MỸ",
    countries: ["USA", "CANADA", "BRAZIL", "MEXICO"],
  },
  {
    tech: "CỔNG NGẪU NHIÊN CHÂU ÂU",
    countries: ["GERMANY", "FRANCE", "NETHERLANDS", "SWEDEN", "UNITED KINGDOM"],
  },
] as const;

const pickRandomItem = <T,>(items: readonly T[]) =>
  items[Math.floor(Math.random() * items.length)];

const formatLogTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

const createConsoleLines = () => {
  const base = new Date();
  const addSeconds = (seconds: number) => new Date(base.getTime() + seconds * 1000);

  return [
    `[${formatLogTime(addSeconds(0))}] Bắt đầu khởi tạo`,
    `[${formatLogTime(addSeconds(0))}] Tắt chế độ giám sát tài khoản và IP từ trang game`,
    `[${formatLogTime(addSeconds(4))}] Kích hoạt tỷ lệ nổ hũ ở mức cao nhất`,
    `[${formatLogTime(addSeconds(8))}] Tăng tối đa BIGWIN và SCATTER liên tục cho tài khoản`,
  ];
};

const createRandomMeta = () => {
  const int = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const hex = (len: number) =>
    Array.from({ length: len }, () => int(0, 15).toString(16).toUpperCase()).join("");

  const ip = `173.16.${int(10, 99)}.${int(1, 254)}`;
  const port = int(10000, 65535);

  return {
    ipPort: `${ip}:${port}`,
    phase: `${int(0, 23).toString().padStart(2, "0")}H ${int(0, 23).toString().padStart(2, "0")}H`,
    branch: `X${int(8, 28)}`,
    scatter: `${int(1, 9)}${String.fromCharCode(65 + int(0, 25))}: MỞ KHÓA`,
    latency: `${int(8, 36)}ms`,
    nodeHex: `0x${hex(6)}`,
  };
};

const DeleteCodePagePro: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isProgressComplete, setIsProgressComplete] = useState(false);
  const [nodeHex, setNodeHex] = useState("0x315D87");
  const [latency, setLatency] = useState(() => `${Math.floor(Math.random() * 17) + 12}ms`);

  const meta = useMemo(() => createRandomMeta(), []);
  const consoleLines = useMemo(() => createConsoleLines(), []);
  const randomAreas = useMemo(
    () =>
      REGION_COUNTRY_POOLS.map((region) => ({
        tech: region.tech,
        area: pickRandomItem(region.countries),
      })),
    [],
  );

  useEffect(() => {
    setProgress(0);
    setDisplayProgress(0);
    setIsProgressComplete(false);

    // Start progress animation after a brief delay
    const startTimeout = setTimeout(() => {
      setProgress(100); // This will trigger CSS animation
    }, 100);

    // Smoothly update display progress from 0 to 100
    const displayInterval = setInterval(() => {
      setDisplayProgress((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(displayInterval);
          return 100;
        }
        return next;
      });
    }, 40); // Update every 40ms for smooth counting

    // Mark as complete after animation duration
    const completeTimeout = setTimeout(() => {
      setIsProgressComplete(true);
      setDisplayProgress(100);
    }, 4100); // 4 seconds total

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(completeTimeout);
      clearInterval(displayInterval);
    };
  }, []);

  useEffect(() => {
    setNodeHex(meta.nodeHex);
    const interval = window.setInterval(() => {
      const chars = "0123456789ABCDEF";
      const next = Array.from({ length: 6 }, () =>
        chars[Math.floor(Math.random() * chars.length)],
      ).join("");
      setNodeHex(`0x${next}`);
    }, 900);

    return () => window.clearInterval(interval);
  }, [meta.nodeHex]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLatency(`${Math.floor(Math.random() * 17) + 12}ms`);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const unlockReady = isProgressComplete;
  const progressText = `${displayProgress.toFixed(0).padStart(2, "0")}.00%`;
  const visibleConsoleLines = useMemo(() => {
    const count = Math.min(
      consoleLines.length,
      Math.floor((displayProgress / 100) * consoleLines.length),
    );
    return consoleLines.slice(0, count);
  }, [consoleLines, displayProgress]);

  const targetInfo = [
    { label: "IP PORT", value: meta.ipPort },
    { label: "MÃ HÓA", value: "ĐÃ MỞ KHÓA ..." },
    { label: "NHÂN HỆ SỐ", value: meta.branch },
    { label: "SCATTER", value: meta.scatter },
  ];

  const targetTech = randomAreas.map((item) => ({
    ...item,
    status: unlockReady ? "MỞ KHÓA" : "SẴN SÀNG",
  }));

  return (
    <div className="delete-code-page">
      {/* Matrix Rain Background */}
      <div className="matrix-rain">
        {Array.from({ length: 14 }, (_, i) => (
          <div
            key={i}
            className="matrix-column"
            style={{
              left: `${4 + i * 6.5}%`,
              animationDelay: `${i * 0.12}s`,
              animationDuration: `${8 + (i % 3) * 0.7}s`,
              opacity: 0.1 + (i % 2) * 0.05,
            }}
          >
            {Array.from({ length: 18 }, (_, j) => (
              <span key={j} className="matrix-char" style={{ animationDelay: `${j * 0.08}s` }}>
                {"0123456789ABCDEF"[Math.floor(Math.random() * 16)]}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Cyber Falling Elements */}
      <div className="cyber-fall">
        {Array.from({ length: 25 }, (_, i) => (
          <div
            key={i}
            className="cyber-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              fontSize: `${0.6 + Math.random() * 0.8}rem`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          >
            {["0", "1", "{", "}", "[", "]", "<", ">", "/", "\\", "|", "-", "_", "+", "=", "*", "&", "%", "$", "#", "@", "!", "?"][Math.floor(Math.random() * 22)]}
          </div>
        ))}
      </div>

      {/* Binary Stream */}
      <div className="binary-stream">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="binary-line"
            style={{
              left: `${10 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + (i % 2) * 2}s`,
            }}
          >
            {Array.from({ length: 12 }, (_, j) => (
              <span key={j} className="binary-digit" style={{ animationDelay: `${j * 0.1}s` }}>
                {Math.random() > 0.5 ? "1" : "0"}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Code Fragments */}
      <div className="code-fragments">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="code-fragment"
            style={{
              left: `${Math.random() * 90}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
              fontSize: `${0.5 + Math.random() * 0.5}rem`,
            }}
          >
            {["function", "const", "let", "var", "if", "else", "for", "while", "class", "import", "export", "return"][Math.floor(Math.random() * 12)]}
          </div>
        ))}
      </div>

      {/* Geometric Symbols */}
      <div className="geometric-symbols">
        {Array.from({ length: 18 }, (_, i) => (
          <div
            key={i}
            className="geometric-symbol"
            style={{
              left: `${Math.random() * 95}%`,
              animationDelay: `${Math.random() * 12}s`,
              animationDuration: `${5 + Math.random() * 4}s`,
              transform: `scale(${0.3 + Math.random() * 0.7})`,
            }}
          >
            {["▲", "▼", "◆", "◇", "●", "○", "■", "□", "★", "☆", "✦", "✧", "✩", "✪", "✫", "✬", "✭", "✮"][Math.floor(Math.random() * 18)]}
          </div>
        ))}
      </div>
      <div className="delete-code-layout">
        <Panel
          title="SYSTEM OVERRIDE"
          className="delete-code-panel--wide"
          bodyClassName="delete-code-panel-body"
        >
          <div
            className="delete-code-card delete-code-header-card"
            style={{
              background:
                "linear-gradient(90deg, rgba(7, 28, 16, 0.78), rgba(29, 9, 37, 0.62), rgba(7, 28, 16, 0.78))",
            }}
          >
            <div
              className="delete-code-title"
              style={{ color: deleteCodeTheme.accent }}
            >
              SYSTEM OVERRIDE
            </div>

            <div className="delete-code-progress-row">
              <div className="delete-code-progress-track">
                <div
                  className={`delete-code-progress-fill ${progress === 100 ? 'progress-animating' : ''}`}
                  style={{ width: progress === 100 ? '100%' : '0%' }}
                />
                <div className="delete-code-progress-grid" />
              </div>

              <span
                className="text-[0.78rem] font-semibold tabular-nums"
                style={{ color: deleteCodeTheme.accentStrong }}
              >
                {progressText}
              </span>
            </div>
          </div>

          <main className="delete-code-main-shell">
            <div
              className="delete-code-card delete-code-main-card"
              style={{ background: "rgba(4, 20, 10, 0.78)" }}
            >
              <div className="delete-code-lock p-4">
                <svg width={108} height={108} viewBox="0 0 80 80" fill="none" aria-hidden="true">
                  <rect
                    x="16"
                    y="36"
                    width="48"
                    height="34"
                    rx="5"
                    fill={deleteCodeTheme.accentAmber}
                    stroke="#fff3cc"
                    strokeWidth="2"
                  />
                  <rect x="35" y="54" width="10" height="12" rx="3" fill="#5a3300" />
                  <path
                    d="M26 36v-9c0-9 7-16 16-16s16 7 16 16v9"
                    stroke={deleteCodeTheme.accentCyan}
                    strokeWidth="4"
                    strokeDasharray="6,7"
                  />
                  <rect x="35" y="66" width="10" height="2" rx="1" fill="#fff3cc" />
                </svg>
              </div>

              <h2
                className="delete-code-main-title"
                style={{ color: deleteCodeTheme.accent }}
              >
                Đã xóa mã ẩn và kích hoạt
              </h2>

              <div
                className="delete-code-center-copy"
                style={{ color: deleteCodeTheme.accentCyan }}
              >
                Hệ thống đã sẵn sàng để truy cập cụm máy chủ quốc tế một cách ổn định
                và an toàn.
              </div>

              <button
                className="delete-code-cta"
                style={{
                  background: "linear-gradient(180deg, rgba(255, 94, 94, 0.2), rgba(120, 10, 10, 0.16))",
                  color: "#ffe3d8",
                  border: "2px solid rgba(255, 109, 83, 0.92)",
                }}
                onClick={() => {
                  window.location.href = "https://MM888T.COM";
                }}
              >
                VÀO LINK GAME
              </button>
              <button
                className="delete-code-cta"
                style={{
                  marginTop: "0.65rem",
                  background: "linear-gradient(90deg, rgba(26,202,255,0.20), rgba(0,57,140,0.20))",
                  color: "#141A26",
                  border: "2px solid #45e7fa",
                  fontWeight: 700,
                  transition: "transform 0.16s cubic-bezier(.62,.19,.41,.95),box-shadow 0.18s",
                  boxShadow: "0 2px 12px 0 rgba(42,164,255,0.08)",
                }}
                onClick={(event) => {
                  // Bounce scale animation
                  const btn = event.currentTarget as HTMLButtonElement;
                  if (btn && btn.animate) {
                    btn.animate(
                      [
                        { transform: "scale(1)" },
                        { transform: "scale(1.12)" },
                        { transform: "scale(0.95)" },
                        { transform: "scale(1)" }
                      ],
                      {
                        duration: 410,
                        easing: "cubic-bezier(.58,1.22,.42,1)"
                      }
                    );
                  }
                  setTimeout(() => navigate("/"), 150); // Navigate with a slight delay
                }}
              >
                Quay về trang chủ
              </button>
            </div>
          </main>

          <section
            className="delete-code-card delete-code-console-card"
            style={{
              color: deleteCodeTheme.textPrimary,
              background: "rgba(1, 8, 4, 0.9)",
            }}
          >
            <div>
              &gt; Lệnh hệ thống:{" "}
              <span style={{ color: deleteCodeTheme.accentAmber }}>xóa toàn bộ mã ẩn</span>
            </div>

            <div
              className="delete-code-console-lines text-[0.85rem]"
              style={{ color: deleteCodeTheme.accentCyan }}
            >
              {visibleConsoleLines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          </section>
        </Panel>

        <Panel title="TRẠNG THÁI MỤC TIÊU">
          <div
            className="delete-code-card delete-code-side-card"
            style={{ background: "rgba(9, 28, 49, 0.16)" }}
          >
            <div className="delete-code-list text-[0.82rem] font-bold">
              {targetInfo.map((row) => (
                <InfoRow key={row.label} label={row.label} value={row.value} />
              ))}
            </div>

            <div className="delete-code-divider" />

            <div className="delete-code-list-section text-[0.82rem] font-bold leading-[1.45]">
              {targetTech.map((item) => (
                <div key={item.tech} className="delete-code-list-item">
                  <InfoRow label={item.tech} value={item.area} />
                  <div className="mt-1">
                    <InfoRow
                      label="TRẠNG THÁI"
                      value={item.status}
                      valueClassName="text-[#7fdcff]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="GIÁM SÁT HỆ THỐNG">
          <div
            className="delete-code-card delete-code-side-card"
            style={{ background: "rgba(9, 28, 49, 0.16)" }}
          >
            <div className="delete-code-node-row">
              <span className="text-[0.82rem] font-bold" style={{ color: deleteCodeTheme.textPrimary }}>
                NODE
              </span>
              <span
                className="text-[0.82rem] font-bold tabular-nums"
                style={{ color: deleteCodeTheme.accent }}
              >
                {nodeHex}
              </span>
            </div>

            <div className="delete-code-list-section text-[0.82rem] font-bold">
              <div className="delete-code-metric">
                <span className="delete-code-metric-label">ĐỘ TRỄ</span>
                <span className="delete-code-metric-value">{latency}</span>
              </div>
              <div className="delete-code-metric">
                <span className="delete-code-metric-label">TƯỜNG LỬA</span>
                <span className="delete-code-metric-value">
                  {unlockReady ? "ĐÃ VƯỢT QUA" : "ĐANG VƯỢT QUA"}
                </span>
              </div>
              <div className="delete-code-divider !my-0 pt-5" />
              <div className="delete-code-metric">
                <span className="delete-code-metric-label">LUỒNG</span>
                <span className="delete-code-metric-value">68 / 128</span>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default DeleteCodePagePro;
