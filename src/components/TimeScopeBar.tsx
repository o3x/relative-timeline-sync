/**
 * TimeScopeBar — 時間スコープ切替バー
 * 今日 / 週 / 月 / 年 / 一生 と 比較モードトグル
 * Last Updated: Sat Jun 27 00:00:00 JST 2026
 */
"use client"

import { TimeScope, CompareMode } from "@/types"

const SCOPES: { value: TimeScope; label: string }[] = [
  { value: "day",      label: "今日" },
  { value: "week",     label: "週" },
  { value: "month",    label: "月" },
  { value: "year",     label: "年" },
  { value: "lifetime", label: "一生" },
]

interface TimeScopeBarProps {
  scope: TimeScope
  onScopeChange: (scope: TimeScope) => void
  compareMode: CompareMode
  onCompareModeChange: (mode: CompareMode) => void
}

export function TimeScopeBar({
  scope,
  onScopeChange,
  compareMode,
  onCompareModeChange,
}: TimeScopeBarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* スコープボタン群 */}
      <div className="scope-bar">
        {SCOPES.map((s) => (
          <button
            key={s.value}
            className={`scope-btn${scope === s.value ? " active" : ""}`}
            onClick={() => onScopeChange(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 比較モードトグル */}
      <button
        className="compare-toggle"
        onClick={() =>
          onCompareModeChange(compareMode === "days" ? "age" : "days")
        }
        title="偉人との比較基準を切り替える"
      >
        <span className={`dot${compareMode === "days" ? " active" : ""}`} />
        {compareMode === "days" ? "同経過日数" : "同い年"}
      </button>
    </div>
  )
}
