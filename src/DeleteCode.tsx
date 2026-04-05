import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const DeleteCode: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [nodeHex, setNodeHex] = useState("0x315D87");

  const rand = useMemo(() => {
    const int = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;
    const hex = (len: number) =>
      Array.from({ length: len }, () => int(0, 15).toString(16).toUpperCase()).join(
        "",
      );

    const ip = `173.16.${int(10, 99)}.${int(1, 254)}`;
    const port = int(10000, 65535);
    const pha1 = int(0, 23).toString().padStart(2, "0");
    const pha2 = int(0, 23).toString().padStart(2, "0");

    return {
      ipPort: `${ip}:${port}`,
      phaHoa: `${pha1}H ${pha2}H`,
      nhanHe: `X${int(1, 99)}.${int(0, 9)}`,
      scatter: `${int(1, 9)}${String.fromCharCode(65 + int(0, 25))}: M0 KHÓA`,
      nodeHex: `0x${hex(6)}`,
    };
  }, []);

  const handleGoToGame = () => {
    navigate("/");
  };

  useEffect(() => {
    setProgress(0);
    const interval = window.setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 1));
    }, 50); // 100 steps * 50ms = 5000ms

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    setNodeHex(rand.nodeHex);
    const interval = window.setInterval(() => {
      const chars = "0123456789ABCDEF";
      const next = Array.from({ length: 6 }, () =>
        chars[Math.floor(Math.random() * chars.length)],
      ).join("");
      setNodeHex(`0x${next}`);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [rand.nodeHex]);

  const progressText = useMemo(
    () => `${progress.toFixed(0).padStart(2, "0")}.00%`,
    [progress],
  );

  const consoleLines = useMemo(
    () => [
        "[12:07:27] Khởi tạo hệ thống nổ hũ...",
        "[12:07:27] Đang tải dữ liệu vòng quay...",
        "[12:07:28] Kích hoạt cơ chế tỉ lệ nổ hũ tối ưu.",
        "[12:07:29] Thiết lập BIGWIN & SCATTER xuất hiện liên tục."
      ],
    [],
  );

  const visibleConsoleLines = useMemo(() => {
    const count = Math.min(
      consoleLines.length,
      Math.floor((progress / 100) * consoleLines.length),
    );
    return consoleLines.slice(0, count);
  }, [consoleLines, progress]);

  const unlockReady = progress >= 100;

  const targetInfo = useMemo(
    () => [
      { label: "IP PORT", value: rand.ipPort },
      { label: "PHA HOA", value: rand.phaHoa },
      { label: "NHAN HE 56", value: rand.nhanHe },
      { label: "SCATTER", value: rand.scatter },
    ],
    [rand],
  );

  const targetTech = useMemo(
    () => [
      {
        tech: "CÔNG NGHỆ NHẬN TÂY A",
        area: "INDIA",
        status: unlockReady ? "MỞ KHÓA" : "SẴN SÀNG",
      },
      {
        tech: "CÔNG NGHỆ NHẬN NAM A",
        area: "SINGAPORE",
        status: unlockReady ? "MỞ KHÓA" : "SẴN SÀNG",
      },
      {
        tech: "CÔNG NGHỆ NHẬN CHÂU MỸ",
        area: "USA & CANADA",
        status: unlockReady ? "MỞ KHÓA" : "SẴN SÀNG",
      },
      {
        tech: "CÔNG NGHỆ NHẬN CHÂU ÂU",
        area: "GERMANY",
        status: unlockReady ? "MỞ KHÓA" : "SẴN SÀNG",
      },
    ],
    [unlockReady],
  );

  return (
    <div
      className="relative isolate w-full min-h-screen overflow-hidden flex flex-col font-mono box-border"
      style={{
        fontFamily: "'Share Tech Mono', 'Fira Mono', monospace",
        fontSize: "23px",
        background:
          "radial-gradient(circle at top left, rgba(34,211,238,0.18), transparent 28%), radial-gradient(circle at top right, rgba(244,114,182,0.18), transparent 24%), linear-gradient(180deg, #081120 0%, #070D1B 48%, #040814 100%)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-80">
        <div className="absolute -top-24 left-[6%] h-72 w-72 rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="absolute top-[18%] right-[8%] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-8%] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
      </div>
      {/* Scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(73,255,243,0.06) 0px, rgba(73,255,243,0.06) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 6px)",
          opacity: 0.9,
        }}
      />

      <div className="relative z-10 flex flex-1 min-h-0">
        <div
          className="w-full flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 rounded-[28px] border border-cyan-300/20 bg-white/[0.04] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 backdrop-blur-md shadow-[0_0_60px_rgba(8,145,178,0.14)]"
          style={{
            margin: "clamp(16px, 4vw, 40px)",
            width: "calc(100% - clamp(32px, 8vw, 80px))",
            boxSizing: "border-box",
          }}
        >
          {/* LEFT PANEL */}
          <section className="w-full lg:col-span-2 min-w-0 flex flex-col border border-cyan-300/40 rounded-[24px] overflow-hidden bg-gradient-to-b from-[#101b35]/86 via-[#142148]/82 to-[#070d1b]/88 shadow-[0_0_24px_rgba(14,207,246,0.22)] backdrop-blur-xl min-h-[640px]">
            {/* (1) Header: system override + progress */}
            <header className="shrink-0 border-b border-cyan-300/35 px-5 py-4 sm:px-6 sm:py-5 bg-white/[0.03]">
              <div className="sys-override-anim text-[#f38dff] text-lg tracking-widest font-bold text-center drop-shadow-[0_0_6px_#f38dff]">
                S.Y.S.T.E.M OVERRIDE
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex-1 h-3 relative rounded overflow-hidden bg-[#23154e] border border-[#884cbd] mr-3">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#ff32b7] via-[#ff5bba] to-[#ffcd32]"
                    style={{ width: `${progress}%` }}
                  />
                  <div className="absolute inset-0 opacity-70 bg-[linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[length:10px_10px]" />
                </div>
                <span
                  className="text-[#ff32b7] font-semibold text-[0.72em] tabular-nums"
                  style={{ textShadow: "0 0 4px #ffcd32, 0 0 8px #ff5bba" }}
                >
                  {progressText}
                </span>
              </div>
            </header>

            <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 lg:p-6 gap-5 lg:gap-6">
              {/* (2) Center: icon + text + button */}
              <main className="lg:basis-[48%] lg:shrink-0 min-h-0 flex flex-col items-center justify-center">
                <div className="w-full flex flex-col items-center justify-center border border-white/18 border-dashed rounded-2xl bg-white/[0.05] px-5 py-9 sm:px-7 sm:py-10 lg:px-9">
                  <div className="lock-zoom-anim rounded-full border-4 border-[#ffc532] bg-[#181151] p-3 shadow-xl mb-3">
                    <svg
                      width={78}
                      height={78}
                      viewBox="0 0 80 80"
                      fill="none"
                      aria-hidden="true"
                    >
                      <rect
                        x="16"
                        y="36"
                        width="48"
                        height="34"
                        rx="5"
                        fill="#ffc532"
                        stroke="#fff"
                        strokeWidth="2"
                      />
                      <rect x="35" y="54" width="10" height="12" rx="3" fill="#1a2233" />
                      <path
                        d="M26 36v-9c0-9 7-16 16-16s16 7 16 16v9"
                        stroke="#fff"
                        strokeWidth="4"
                        strokeDasharray="6,7"
                      />
                      <rect x="35" y="66" width="10" height="2" rx="1" fill="#fff" />
                    </svg>
                  </div>

                  <h2 className="text-[#ff51ed] text-lg font-semibold text-center drop-shadow-[0_0_10px_#ff32b7] tracking-widest">
                    ĐÃ XÓA MÃ ẨN & KÍCH HOẠT
                  </h2>
                  <div className="text-[#81daf5] text-[0.72em] text-center mt-2 tracking-widest opacity-90">
                    AN TOÀN ĐỂ TRUY CẬP CÔNG ƯỚC TẾ
                  </div>

                  <button
                    className="mt-6 bg-[#ff32b7] border-2 border-[#ffc532] px-10 py-2 rounded-md text-[0.72em] font-bold tracking-widest text-[#0b0d13] shadow-[0_0_18px_rgba(255,50,183,0.55)] hover:brightness-110 transition-all duration-200"
                    onClick={handleGoToGame}
                    style={{ textShadow: "0 0 6px #ffcd32" }}
                  >
                    VÀO LINK GAME
                  </button>
                </div>
              </main>

              {/* (3) Bottom: console 4 lines */}
              <section className="lg:basis-[52%] lg:shrink-0 bg-black/40 border border-white/12 rounded-2xl px-4 py-4 sm:px-6 sm:py-5 text-[#bcf3ff] text-[0.72em] font-bold tracking-tight backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="text-pink-300">
                  &gt; S.Y.S.T.E.M Command:{" "}
                  <span className="text-[#ffff88]">delete hidden code all</span>
                </div>
                <div className="mt-2 text-[0.72em] space-y-1">
                  {visibleConsoleLines.map((line, idx) => (
                    <div
                      key={idx}
                      className={
                        idx === 2 ? "text-green-300" : "text-cyan-200"
                      }
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>

          {/* MIDDLE PANEL */}
          <section className="w-full lg:col-span-1 min-w-0 flex flex-col border border-cyan-300/35 bg-[#061123]/80 rounded-[24px] overflow-hidden backdrop-blur-xl shadow-[0_0_22px_rgba(34,211,238,0.12)]">
            <header className="border-b border-cyan-300/30 px-5 py-4 sm:px-6 text-[#49fff3] text-[0.75em] font-bold text-center tracking-widest bg-white/[0.03]">
              TRẠNG THÁI MỤC TIÊU
            </header>

            <div className="flex-1 p-4 sm:p-5 lg:p-6 overflow-hidden">
              <div className="h-full border border-white/12 rounded-2xl bg-white/[0.05] px-4 py-5 sm:px-5 sm:py-6 overflow-hidden backdrop-blur-md">
                <div className="space-y-3 text-[0.72em] font-bold">
                  {targetInfo.map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-baseline"
                    >
                      <span className="text-[#49fff3] font-bold">
                        {row.label}:
                      </span>
                      <span className="text-[#ffff88] font-bold">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 mt-5 mb-5" />

                <div className="space-y-5 text-[0.72em] font-bold leading-[1.45]">
                  {targetTech.map((t) => (
                    <div key={t.tech} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[#49fff3]">{t.tech}:</span>
                        <span className="text-[#ffff88]">{t.area}</span>
                      </div>
                      <div className="flex justify-between items-baseline mt-1">
                        <span className="text-[#49fff3]">TRẠNG THÁI:</span>
                        <span className="text-[#81daf5]">{t.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT PANEL */}
          <section className="w-full lg:col-span-1 min-w-0 flex flex-col border border-cyan-300/35 bg-[#061123]/80 rounded-[24px] overflow-hidden backdrop-blur-xl shadow-[0_0_22px_rgba(34,211,238,0.12)]">
            <header className="border-b border-cyan-300/30 px-5 py-4 sm:px-6 text-[#49fff3] text-[0.75em] font-bold text-center tracking-widest bg-white/[0.03]">
              GIÁM SÁT HỆ THỐNG
            </header>

            <div className="flex-1 p-4 sm:p-5 lg:p-6">
              <div className="h-full border border-white/12 rounded-2xl bg-white/[0.05] px-4 py-5 sm:px-5 sm:py-6 overflow-hidden backdrop-blur-md">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-[#49fff3] font-bold text-[0.72em]">
                    NODE
                  </span>
                  <span className="text-[#ffff88] font-bold text-[0.72em] tabular-nums">
                    {nodeHex}
                  </span>
                </div>

                <div className="space-y-5 text-[0.72em] font-bold leading-[1.4]">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[#49fff3]">ĐỘ TRỄ</span>
                    <span className="text-[#81daf5] tabular-nums">12ms</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[#49fff3]">TƯỜNG LỬA</span>
                    <span className="text-[#ffff88]">
                      {unlockReady ? "ĐÃ VƯỢT QUA" : "ĐANG VƯỢT QUA"}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-white/10 pt-5">
                    <span className="text-[#49fff3]">LUỒNG</span>
                    <span className="text-[#81daf5] tabular-nums">68 / 128</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DeleteCode;
