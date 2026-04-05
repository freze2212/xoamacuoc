import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./delete-code.css";
import { InfoRow, Panel } from "./components";
import { deleteCodeTheme } from "./theme";

const REGION_COUNTRY_POOLS = [
  {
    tech: "Cá»”NG NGáºªU NHIÃŠN TÃ‚Y Ã",
    countries: ["INDIA", "PAKISTAN", "BANGLADESH", "SRI LANKA"],
  },
  {
    tech: "Cá»”NG NGáºªU NHIÃŠN NAM Ã",
    countries: ["SINGAPORE", "THAILAND", "MALAYSIA", "INDONESIA", "VIETNAM"],
  },
  {
    tech: "Cá»”NG NGáºªU NHIÃŠN CHÃ‚U Má»¸",
    countries: ["USA", "CANADA", "BRAZIL", "MEXICO"],
  },
  {
    tech: "Cá»”NG NGáºªU NHIÃŠN CHÃ‚U Ã‚U",
    countries: ["GERMANY", "FRANCE", "NETHERLANDS", "SWEDEN", "UNITED KINGDOM"],
  },
] as const;

const pickRandomItem = <T,>(items: readonly T[]) =>
  items[Math.floor(Math.random() * items.length)];

const createRandomMeta = () => {
  const int = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const hex = (len: number) =>
    Array.from({ length: len }, () => int(0, 15).toString(16).toUpperCase()).join(
      "",
    );

  const ip = `173.16.${int(10, 99)}.${int(1, 254)}`;
  const port = int(10000, 65535);

  return {
    ipPort: `${ip}:${port}`,
    phase: "13H 09H",
    branch: `X${int(8, 28)}`,
    scatter: `${int(1, 9)}${String.fromCharCode(65 + int(0, 25))}: Má»Ÿ khÃ³a`,
    nodeHex: `0x${hex(6)}`,
  };
};

const consoleLines = [
  "[12:07:27] Khá»Ÿi táº¡o há»‡ thá»‘ng má»Ÿ khÃ³a...",
  "[12:07:27] Äang táº£i dá»¯ liá»‡u vÃ²ng quay...",
  "[12:07:28] Tá»‘i Æ°u tá»· lá»‡ BIGWIN vÃ  SCATTER.",
  "[12:07:29] Äá»“ng bá»™ cÃ¡c cá»¥m mÃ¡y chá»§ quá»‘c táº¿.",
];

const DeleteCodeScreenRandom: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [nodeHex, setNodeHex] = useState("0x315D87");

  const meta = useMemo(() => createRandomMeta(), []);
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
    const interval = window.setInterval(() => {
      setProgress((current) => (current >= 100 ? 100 : current + 1));
    }, 50);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    setNodeHex(meta.nodeHex);
    const interval = window.setInterval(() => {
      const chars = "0123456789ABCDEF";
      const next = Array.from({ length: 6 }, () =>
        chars[Math.floor(Math.random() * chars.length)],
      ).join("");
      setNodeHex(`0x${next}`);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [meta.nodeHex]);

  const progressText = useMemo(
    () => `${progress.toFixed(0).padStart(2, "0")}.00%`,
    [progress],
  );

  const unlockReady = progress >= 100;
  const visibleConsoleLines = useMemo(() => {
    const count = Math.min(
      consoleLines.length,
      Math.floor((progress / 100) * consoleLines.length),
    );
    return consoleLines.slice(0, count);
  }, [progress]);

  const targetInfo = [
    { label: "IP PORT", value: meta.ipPort },
    { label: "MÃƒ HÃ“A", value: "ÄÃƒ Má»ž KHÃ“A ..." },
    { label: "NHÃ‚N Há»† Sá»", value: meta.branch },
    { label: "SCATTER", value: meta.scatter },
  ];

  const targetTech = useMemo(
    () =>
      randomAreas.map((item) => ({
        ...item,
        status: unlockReady ? "Má»Ÿ khÃ³a" : "Sáºµn sÃ ng",
      })),
    [randomAreas, unlockReady],
  );

  return (
    <div className="delete-code-page">
      <div className="delete-code-layout">
        <Panel title="SYSTEM OVERRIDE" className="delete-code-panel--wide" bodyClassName="delete-code-panel-body">
          <div
            className="delete-code-card delete-code-header-card"
            style={{ background: "linear-gradient(90deg, rgba(7, 28, 16, 0.78), rgba(29, 9, 37, 0.62), rgba(7, 28, 16, 0.78))" }}
          >
            <div
              className="delete-code-title sys-override-anim text-lg font-bold drop-shadow-[0_0_10px_rgba(64,187,238,0.6)]"
              style={{ color: deleteCodeTheme.accent }}
            >
              SYSTEM OVERRIDE
            </div>

            <div className="delete-code-progress-row">
              <div className="delete-code-progress-track">
                <div
                  className="delete-code-progress-fill"
                  style={{ width: `${progress}%` }}
                />
                <div className="delete-code-progress-grid" />
              </div>

              <span
                className="text-[0.72em] font-semibold tabular-nums drop-shadow-[0_0_8px_rgba(64,187,238,0.55)]"
                style={{ color: deleteCodeTheme.accentStrong }}
              >
                {progressText}
              </span>
            </div>
          </div>

          <main className="delete-code-main-shell flex min-h-0 flex-col items-center justify-center lg:basis-[48%] lg:shrink-0">
            <div
              className="delete-code-card delete-code-main-card flex w-full flex-col items-center justify-center border-dashed"
              style={{ background: "rgba(4, 20, 10, 0.78)" }}
            >
              <div className="lock-zoom-anim delete-code-lock mb-5 p-5">
                <svg
                  width={118}
                  height={118}
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
                className="delete-code-main-title text-center font-semibold tracking-[0.08em] drop-shadow-[0_0_10px_rgba(64,187,238,0.58)]"
                style={{ color: deleteCodeTheme.accent }}
              >
                ÄÃ£ xÃ³a mÃ£ áº©n vÃ  kÃ­ch hoáº¡t
              </h2>

              <div
                className="delete-code-center-copy mt-4 opacity-95"
                style={{ color: deleteCodeTheme.accentCyan }}
              >
                Há»‡ thá»‘ng Ä‘Ã£ sáºµn sÃ ng Ä‘á»ƒ truy cáº­p cá»¥m mÃ¡y chá»§ quá»‘c táº¿ má»™t cÃ¡ch á»•n Ä‘á»‹nh
                vÃ  an toÃ n.
              </div>

              <button
                className="delete-code-cta mt-8 px-12 py-4 font-bold tracking-[0.08em] transition-all duration-200 hover:brightness-110"
                style={{
                  background: "transparent",
                  color: deleteCodeTheme.accent,
                }}
                onClick={() => navigate("/")}
              >
                VÃ€O LINK GAME
              </button>
            </div>
          </main>

          <section
            className="delete-code-card delete-code-console-card text-[0.72em] font-bold tracking-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] lg:basis-[52%] lg:shrink-0"
            style={{
              color: deleteCodeTheme.textPrimary,
              background: "rgba(1, 8, 4, 0.9)",
            }}
          >
            <div>
              &gt; Lá»‡nh há»‡ thá»‘ng:{" "}
              <span style={{ color: deleteCodeTheme.accentAmber }}>
                xÃ³a toÃ n bá»™ mÃ£ áº©n
              </span>
            </div>

            <div
              className="delete-code-console-lines text-[0.72em]"
              style={{ color: deleteCodeTheme.accentCyan }}
            >
              {visibleConsoleLines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          </section>
        </Panel>

        <Panel title="TRáº NG THÃI Má»¤C TIÃŠU">
          <div
            className="delete-code-card delete-code-side-card"
            style={{ background: "rgba(9, 28, 49, 0.16)" }}
          >
            <div className="delete-code-list text-[0.72em] font-bold">
              {targetInfo.map((row) => (
                <InfoRow key={row.label} label={row.label} value={row.value} />
              ))}
            </div>

            <div className="delete-code-divider" />

            <div className="delete-code-list-section text-[0.72em] font-bold leading-[1.45]">
              {targetTech.map((item) => (
                <div key={item.tech} className="delete-code-list-item">
                  <InfoRow label={item.tech} value={item.area} />
                  <div className="mt-1">
                    <InfoRow
                      label="Tráº¡ng thÃ¡i"
                      value={item.status}
                      valueClassName="text-[#4de7ff]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="GIÃM SÃT Há»† THá»NG">
          <div
            className="delete-code-card delete-code-side-card"
            style={{ background: "rgba(9, 28, 49, 0.16)" }}
          >
            <div className="delete-code-node-row">
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

            <div className="delete-code-list-section text-[0.72em] font-bold leading-[1.45]">
              <InfoRow label="Äá»™ trá»…" value="12ms" />
              <InfoRow
                label="TÆ°á»ng lá»­a"
                value={unlockReady ? "ÄÃ£ vÆ°á»£t qua" : "Äang vÆ°á»£t qua"}
                valueClassName="text-[#ffbf47]"
              />
              <div className="delete-code-divider !my-0 pt-5">
                <InfoRow label="Luá»“ng" value="68 / 128" />
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default DeleteCodeScreenRandom;
