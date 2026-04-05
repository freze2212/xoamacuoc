import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  consoleLines,
  createRandomMeta,
  createTargetInfo,
  createTargetTech,
} from "./data";
import { InfoRow, Panel } from "./components";
import { deleteCodeTheme } from "./theme";

const DeleteCodePage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [nodeHex, setNodeHex] = useState("0x315D87");

  const randomMeta = useMemo(() => createRandomMeta(), []);

  useEffect(() => {
    setProgress(0);
    const interval = window.setInterval(() => {
      setProgress((current) => (current >= 100 ? 100 : current + 1));
    }, 50);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    setNodeHex(randomMeta.nodeHex);
    const interval = window.setInterval(() => {
      const chars = "0123456789ABCDEF";
      const next = Array.from({ length: 6 }, () =>
        chars[Math.floor(Math.random() * chars.length)],
      ).join("");

      setNodeHex(`0x${next}`);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [randomMeta.nodeHex]);

  const progressText = useMemo(
    () => `${progress.toFixed(0).padStart(2, "0")}.00%`,
    [progress],
  );

  const visibleConsoleLines = useMemo(() => {
    const count = Math.min(
      consoleLines.length,
      Math.floor((progress / 100) * consoleLines.length),
    );

    return consoleLines.slice(0, count);
  }, [progress]);

  const unlockReady = progress >= 100;
  const targetInfo = useMemo(() => createTargetInfo(randomMeta), [randomMeta]);
  const targetTech = useMemo(() => createTargetTech(unlockReady), [unlockReady]);

  return (
    <div
      className="relative isolate flex min-h-screen w-full overflow-hidden font-mono"
      style={{
        fontFamily: "'Share Tech Mono', 'Fira Mono', monospace",
        fontSize: "23px",
        backgroundColor: "#030b12",
        backgroundImage:
          "linear-gradient(rgba(3,11,18,0.7), rgba(3,11,18,0.84)), url('/bg-pc.jpg')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(64,187,238,0.24),transparent_28%),radial-gradient(circle_at_top_right,rgba(64,187,238,0.18),transparent_24%),radial-gradient(circle_at_bottom,rgba(64,187,238,0.12),transparent_32%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(to_bottom,rgba(64,187,238,0.05)_0px,rgba(64,187,238,0.05)_1px,rgba(0,0,0,0)_1px,rgba(0,0,0,0)_6px)] opacity-60" />

      <div className="relative z-10 flex min-h-0 flex-1">
        <div
          className="grid min-h-0 w-full flex-1 grid-cols-1 gap-7 rounded-[28px] border border-[rgba(118,215,255,0.14)] bg-transparent px-4 py-5 sm:px-6 sm:py-6 lg:grid-cols-4 lg:gap-10 lg:px-8 lg:py-8"
          style={{
            margin: "clamp(16px, 4vw, 40px)",
            width: "calc(100% - clamp(32px, 8vw, 80px))",
            boxSizing: "border-box",
          }}
        >
          <Panel
            title="HỆ THỐNG GHI ĐÈ"
            className="lg:col-span-2 min-h-[640px]"
            bodyClassName="flex min-h-0 flex-col gap-5 sm:gap-6"
          >
            <div
              className="shrink-0 rounded-2xl border px-7 py-5 sm:px-8 sm:py-6"
              style={{
                borderColor: "rgba(118,215,255,0.24)",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="sys-override-anim text-center text-lg font-bold tracking-[0.18em] drop-shadow-[0_0_10px_rgba(64,187,238,0.6)]"
                style={{ color: deleteCodeTheme.textPrimary }}
              >
                HỆ THỐNG GHI ĐÈ
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="relative h-3 flex-1 overflow-hidden rounded-full border border-[rgba(64,187,238,0.34)] bg-[rgba(6,22,40,0.9)]">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#2087b6_0%,#40bbee_45%,#b4efff_100%)] shadow-[0_0_18px_rgba(64,187,238,0.45)]"
                    style={{ width: `${progress}%` }}
                  />
                  <div className="absolute inset-0 opacity-60 bg-[linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[length:10px_10px]" />
                </div>
                <span
                  className="text-[0.72em] font-semibold tabular-nums drop-shadow-[0_0_8px_rgba(64,187,238,0.55)]"
                  style={{ color: deleteCodeTheme.textPrimary }}
                >
                  {progressText}
                </span>
              </div>
            </div>

            <main className="flex min-h-0 flex-col items-center justify-center lg:basis-[48%] lg:shrink-0">
              <div
                className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed px-7 py-10 sm:px-9 sm:py-11 lg:px-12"
                style={{
                  borderColor: "rgba(118,215,255,0.24)",
                  background: deleteCodeTheme.panelInnerBg,
                }}
              >
                <div className="lock-zoom-anim mb-3 rounded-full border-4 border-[#40bbee] bg-[rgba(6,22,40,0.92)] p-3 shadow-[0_0_24px_rgba(64,187,238,0.22)]">
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
                      fill="#40bbee"
                      stroke="#dff7ff"
                      strokeWidth="2"
                    />
                    <rect x="35" y="54" width="10" height="12" rx="3" fill="#031018" />
                    <path
                      d="M26 36v-9c0-9 7-16 16-16s16 7 16 16v9"
                      stroke="#dff7ff"
                      strokeWidth="4"
                      strokeDasharray="6,7"
                    />
                    <rect x="35" y="66" width="10" height="2" rx="1" fill="#dff7ff" />
                  </svg>
                </div>

                <h2
                  className="text-center text-lg font-semibold tracking-[0.12em] drop-shadow-[0_0_10px_rgba(64,187,238,0.58)]"
                  style={{ color: deleteCodeTheme.textPrimary }}
                >
                  Đã xóa mã ẩn và kích hoạt
                </h2>
                <div
                  className="mt-3 max-w-[34rem] text-center text-[0.72em] leading-[1.7] opacity-95"
                  style={{ color: deleteCodeTheme.textSecondary }}
                >
                  Hệ thống đã sẵn sàng để truy cập cụm máy chủ quốc tế một cách ổn định và an toàn.
                </div>

                <button
                  className="mt-7 rounded-md border border-[rgba(118,215,255,0.8)] px-10 py-2.5 text-[0.72em] font-bold tracking-[0.12em] shadow-[0_0_22px_rgba(64,187,238,0.34)] transition-all duration-200 hover:brightness-110"
                  style={{
                    background: deleteCodeTheme.accent,
                    color: deleteCodeTheme.buttonText,
                  }}
                  onClick={() => navigate("/")}
                >
                  VAO LINK GAME
                </button>
              </div>
            </main>

            <section
              className="rounded-2xl border px-7 py-5 text-[0.72em] font-bold tracking-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md sm:px-8 sm:py-6 lg:basis-[52%] lg:shrink-0"
              style={{
                color: deleteCodeTheme.textPrimary,
                borderColor: "rgba(118,215,255,0.22)",
                background: "rgba(0,0,0,0.28)",
              }}
            >
              <div>
                &gt; Lệnh hệ thống:{" "}
                <span style={{ color: deleteCodeTheme.accentStrong }}>xóa toàn bộ mã ẩn</span>
              </div>
              <div
                className="mt-3 space-y-2.5 px-1 text-[0.72em] leading-[1.7]"
                style={{ color: deleteCodeTheme.textSecondary }}
              >
                {visibleConsoleLines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            </section>
          </Panel>

          <Panel title="TRẠNG THÁI MỤC TIÊU" className="lg:col-span-1">
            <div
              className="h-full rounded-2xl border px-7 py-6 backdrop-blur-md sm:px-8 sm:py-7"
              style={{
                borderColor: "rgba(118,215,255,0.22)",
                background: deleteCodeTheme.panelInnerBg,
              }}
            >
              <div className="space-y-3 text-[0.72em] font-bold">
                {targetInfo.map((row) => (
                  <InfoRow key={row.label} label={row.label} value={row.value} />
                ))}
              </div>

              <div className="my-5 border-t border-[rgba(64,187,238,0.16)]" />

              <div className="space-y-5 text-[0.72em] font-bold leading-[1.45]">
                {targetTech.map((item) => (
                  <div
                    key={item.tech}
                    className="border-b border-[rgba(64,187,238,0.12)] pb-4 last:border-b-0 last:pb-0"
                  >
                    <InfoRow label={item.tech} value={item.area} />
                    <div className="mt-1">
                      <InfoRow label="Trạng thái" value={item.status} valueClassName="text-[#7fdcff]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel title="GIÁM SÁT HỆ THỐNG" className="lg:col-span-1">
            <div
              className="h-full rounded-2xl border px-7 py-6 backdrop-blur-md sm:px-8 sm:py-7"
              style={{
                borderColor: "rgba(118,215,255,0.22)",
                background: deleteCodeTheme.panelInnerBg,
              }}
            >
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <span
                  className="text-[0.72em] font-bold"
                  style={{ color: deleteCodeTheme.textPrimary }}
                >
                  NODE
                </span>
                <span
                  className="text-[0.72em] font-bold tabular-nums"
                  style={{ color: deleteCodeTheme.accent }}
                >
                  {nodeHex}
                </span>
              </div>

              <div className="space-y-5 text-[0.72em] font-bold leading-[1.4]">
                <InfoRow label="Độ trễ" value="12ms" />
                <InfoRow
                  label="Tường lửa"
                  value={unlockReady ? "Đã vượt qua" : "Đang vượt qua"}
                  valueClassName="text-[#7fdcff]"
                />
                <div className="border-t border-[rgba(64,187,238,0.16)] pt-5">
                  <InfoRow label="Luồng" value="68 / 128" />
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default DeleteCodePage;
