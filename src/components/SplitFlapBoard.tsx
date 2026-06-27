/**
 * SplitFlapBoard — 反転フラップ式案内表示機ボード
 * ボードアイテムをパタパタアニメーションで表示する
 * Last Updated: Sat Jun 27 00:00:00 JST 2026
 */
"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { BoardItem, TimeScope, CompareMode } from "@/types"

interface SplitFlapBoardProps {
  items: BoardItem[]
  /** アニメーションのトリガーキー: 変わるたびにフリップが走る */
  animKey: string
  quickMode: boolean
}

export function SplitFlapBoard({ items, animKey, quickMode }: SplitFlapBoardProps) {
  const [renderKey, setRenderKey] = useState(animKey)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prevKeyRef = useRef(animKey)

  useEffect(() => {
    if (animKey === prevKeyRef.current) return
    prevKeyRef.current = animKey

    if (quickMode) {
      setRenderKey(animKey)
      return
    }

    // フリップアニメーション: キーを変更してアイテムを再マウント
    setIsTransitioning(true)
    const t = setTimeout(() => {
      setRenderKey(animKey)
      setIsTransitioning(false)
    }, 80) // 少し遅延してから切り替え（パタパタ感）
    return () => clearTimeout(t)
  }, [animKey, quickMode])

  if (items.length === 0) {
    return (
      <div className="flap-row flap-row-empty">
        <div className="flap-row-bg" />
        <div className="flap-cell flap-cell-date" />
        <div className="flap-cell flap-cell-title">
          ( イベントがありません。設定からカレンダーをインポートしてください。)
        </div>
        <div className="flap-cell flap-cell-person" />
      </div>
    )
  }

  return (
    <div className={`board-container${quickMode ? " quick-mode" : ""}`}>
      {items.map((item, index) => (
        <FlapRow
          key={`${renderKey}-${item.id}`}
          item={item}
          index={index}
          animating={!quickMode}
        />
      ))}
    </div>
  )
}

// ─── 個別フラップ行 ───────────────────────────────────────

interface FlapRowProps {
  item: BoardItem
  index: number
  animating: boolean
}

function FlapRow({ item, index, animating }: FlapRowProps) {
  const delay = animating ? Math.min(index * 55, 600) : 0

  if (item.type === "section-header") {
    return (
      <div className="flap-row-section">
        <span className="flap-section-label">▌ {item.col2} ▌</span>
      </div>
    )
  }

  if (item.type === "empty") {
    return (
      <div
        className={`flap-row flap-row-empty${animating ? " flap-animate-in" : ""}`}
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="flap-row-bg" />
        <div className="flap-cell flap-cell-date">
          <span>{item.col1}</span>
        </div>
        <div className="flap-cell flap-cell-title">
          <span>{item.col2}</span>
        </div>
        <div className="flap-cell flap-cell-person">
          <span>{item.col3}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flap-row${animating ? " flap-animate-in" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flap-row-bg" />

      {/* アクセントカラーバー（偉人行） */}
      {item.accentColor && item.type === "famous" && (
        <span
          className="flap-accent-bar"
          style={{ background: item.accentColor }}
        />
      )}

      {/* 日時・年齢列 */}
      <div className="flap-cell flap-cell-date">
        <span>{item.col1}</span>
      </div>

      {/* タイトル列 */}
      <div className="flap-cell flap-cell-title">
        <span className="truncate">{item.col2}</span>
        {item.subtext && (
          <span
            className="ml-2 text-[0.6rem] tracking-wider shrink-0"
            style={{ color: "var(--board-amber-dim)" }}
          >
            {item.subtext}
          </span>
        )}
      </div>

      {/* 人物名列 */}
      <div className="flap-cell flap-cell-person">
        {item.accentColor ? (
          <span style={{ color: item.accentColor }}>{item.col3}</span>
        ) : (
          <span>{item.col3}</span>
        )}
      </div>
    </div>
  )
}
