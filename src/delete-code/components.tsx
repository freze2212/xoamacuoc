import type { ReactNode } from "react";

import "./delete-code-pro.css";
import { deleteCodeTheme } from "./theme";

type PanelProps = {
  title: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function Panel({ title, children, className = "", bodyClassName = "" }: PanelProps) {
  return (
    <section
      className={`delete-code-panel w-full min-w-0 flex flex-col overflow-hidden ${className}`}
      style={{
        border: `1px solid ${deleteCodeTheme.accentBorder}`,
        background: deleteCodeTheme.panelBg,
        boxShadow: deleteCodeTheme.shadow,
      }}
    >
      <header
        className="delete-code-panel-header text-center font-bold"
        style={{
          borderBottom: `1px solid ${deleteCodeTheme.accentBorder}`,
          color: deleteCodeTheme.textPrimary,
        }}
      >
        {title}
      </header>
      <div className={`flex-1 p-4 sm:p-5 lg:p-6 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
  valueClassName?: string;
};

export function InfoRow({ label, value, valueClassName = "" }: InfoRowProps) {
  return (
    <div className="flex flex-wrap justify-between items-baseline gap-3 px-1">
      <span
        className="min-w-0 pr-2 font-bold leading-[1.6]"
        style={{ color: deleteCodeTheme.textPrimary }}
      >
        {label}:
      </span>
      <span
        className={`max-w-full break-words text-right font-bold leading-[1.6] ${valueClassName || "text-[#d1f1ff]"}`}
      >
        {value}
      </span>
    </div>
  );
}
