/**
 * SplashScreen — アプリ起動画面
 * App Store品質のスプラッシュ演出
 * Last Updated: Sat Jun 27 00:00:00 JST 2026
 */
"use client"

import { useEffect, useState } from "react"

interface SplashScreenProps {
  onComplete: () => void
  /** trueの場合、スプラッシュをスキップ */
  skip?: boolean
}

export function SplashScreen({ onComplete, skip }: SplashScreenProps) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (skip) {
      onComplete()
      return
    }
    // 2.2秒後にフェードアウト開始
    const fadeTimer = setTimeout(() => setFading(true), 2200)
    // フェードアウト完了後にコールバック
    const doneTimer = setTimeout(() => onComplete(), 3100)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [skip, onComplete])

  if (skip) return null

  return (
    <div className={`splash-screen${fading ? " fade-out" : ""}`}>
      {/* SVGアイコン：スタイライズされた反転フラップボード */}
      <div className="splash-icon mb-8">
        <SolariIcon />
      </div>

      {/* タイトル */}
      <h1 className="splash-title text-amber text-2xl font-bold tracking-[0.3em] mb-2">
        RELATIVE TIMELINE
      </h1>

      {/* サブタイトル */}
      <p className="splash-sub text-[0.65rem] tracking-[0.2em] text-amber-dim">
        あなたの今日と、偉人たちの同じ瞬間
      </p>

      {/* パルスドット */}
      <div className="flex gap-1.5 mt-10">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="splash-dot w-1 h-1 rounded-full bg-amber-500"
            style={{ animationDelay: `${1 + i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )
}

/** ミニチュア反転フラップボードのSVGアイコン */
function SolariIcon() {
  // 3列 × 4行のグリッド
  const cols = 3
  const rows = 4
  const cellW = 28
  const cellH = 36
  const gap = 3
  const radius = 2
  const totalW = cols * cellW + (cols - 1) * gap
  const totalH = rows * cellH + (rows - 1) * gap

  // 点灯パターン（偉人の名前のような演出）
  const lit: boolean[][] = [
    [true,  true,  false],
    [true,  false, true ],
    [false, true,  true ],
    [true,  true,  true ],
  ]

  // 各セルに表示するキャラクター（演出用）
  const chars: string[][] = [
    ["R", "T", "S"],
    ["1", "0", "2"],
    ["A", "M", "B"],
    ["E", "R", "·"],
  ]

  return (
    <svg
      width={totalW + 24}
      height={totalH + 24}
      viewBox={`0 0 ${totalW + 24} ${totalH + 24}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 外枠 */}
      <rect
        x={0} y={0}
        width={totalW + 24} height={totalH + 24}
        rx={6}
        fill="#0d0b06"
        stroke="#1f1a10"
        strokeWidth={1}
      />

      {/* フラップセル群 */}
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const x = 12 + c * (cellW + gap)
          const y = 12 + r * (cellH + gap)
          const isLit = lit[r][c]
          const char = chars[r][c]

          return (
            <g key={`${r}-${c}`}>
              {/* セル背景（上半分） */}
              <rect
                x={x} y={y}
                width={cellW} height={cellH / 2}
                rx={radius} ry={radius}
                fill={isLit ? "#1c1610" : "#0d0b06"}
              />
              {/* セル背景（下半分） */}
              <rect
                x={x} y={y + cellH / 2}
                width={cellW} height={cellH / 2}
                rx={radius} ry={radius}
                fill={isLit ? "#0f0c07" : "#080604"}
              />
              {/* 分割ライン */}
              <rect
                x={x} y={y + cellH / 2 - 0.5}
                width={cellW} height={1}
                fill="#000"
              />
              {/* テキスト */}
              {isLit && (
                <text
                  x={x + cellW / 2}
                  y={y + cellH / 2 + 5}
                  textAnchor="middle"
                  fill="#f0a422"
                  fontSize={13}
                  fontFamily="'Courier New', monospace"
                  fontWeight="bold"
                  style={{ filter: "drop-shadow(0 0 4px rgba(240,164,34,0.6))" }}
                >
                  {char}
                </text>
              )}
            </g>
          )
        })
      )}
    </svg>
  )
}
