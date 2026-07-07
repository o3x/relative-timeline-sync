/**
 * SplitFlapBoard — 反転フラップ式案内表示機ボード
 * 実物の空港掲示板と同じく YEARS｜DAYS｜WHO｜Description｜YYYY｜MM｜DD の7列構成。
 * 数字列は1文字ずつ FlapDigit でめくれて値が切り替わる（本物のフラップ機構を再現）。
 * Last Updated: Tue Jul 07 20:00:00 JST 2026
 */
"use client"

import { useEffect, useRef, useState } from "react"
import { BoardItem } from "@/types"

interface SplitFlapBoardProps {
  items: BoardItem[]
  quickMode: boolean
}

export function SplitFlapBoard({ items, quickMode }: SplitFlapBoardProps) {
  if (items.length === 0) {
    return <EmptyRow message="( イベントがありません。設定からカレンダーをインポートしてください。)" />
  }

  return (
    <div>
      {items.map((item, index) => (
        // 位置ベースのkey: scope/compareMode切替でも同じマス(位置)のDOMを再利用し、
        // FlapDigitが「直前の値→新しい値」の差分を検知して本物のようにめくれさせる。
        <FlapRow key={index} item={item} animate={!quickMode} />
      ))}
    </div>
  )
}

// ─── 個別フラップ行 ───────────────────────────────────────

interface FlapRowProps {
  item: BoardItem
  animate: boolean
}

function FlapRow({ item, animate }: FlapRowProps) {
  if (item.type === "section-header") {
    return (
      <div className="flap-row-section">
        <span className="flap-section-label">▌ {item.description} ▌</span>
      </div>
    )
  }

  if (item.type === "empty") {
    return <EmptyRow message={item.description} />
  }

  const yyyy = item.date ? item.date.slice(0, 4) : "----"
  const mm = item.date ? item.date.slice(5, 7) : "--"
  const dd = item.date ? item.date.slice(8, 10) : "--"
  const isMe = item.who === "あなた"

  return (
    <div className="flap-row">
      <div className="flap-row-bg" />

      {item.accentColor && item.type === "famous" && (
        <span className="flap-accent-bar" style={{ background: item.accentColor }} />
      )}

      <div className="flap-group flap-group-years">
        <DigitBank value={pad(item.years, 3)} animate={animate} />
      </div>
      <div className="flap-group flap-group-days">
        <DigitBank value={pad(item.days, 3)} animate={animate} />
      </div>

      <div className="flap-cell flap-cell-who">
        <span
          className="who-badge"
          style={{ background: isMe || !item.accentColor ? undefined : item.accentColor }}
        >
          {item.who}
        </span>
      </div>

      <div className="flap-cell flap-cell-desc">
        <span className="truncate">{item.description}</span>
        {item.subtext && <span className="flap-subtext">{item.subtext}</span>}
      </div>

      <div className="flap-group flap-group-yyyy">
        <DigitBank value={yyyy} animate={animate} />
      </div>
      <div className="flap-group flap-group-mm">
        <DigitBank value={mm} animate={animate} />
      </div>
      <div className="flap-group flap-group-dd">
        <DigitBank value={dd} animate={animate} />
      </div>
    </div>
  )
}

// ─── 空行 ─────────────────────────────────────────────────

function EmptyRow({ message }: { message: string }) {
  return (
    <div className="flap-row flap-row-empty">
      <div className="flap-row-bg" />
      <div className="flap-cell-desc-full">
        <span>{message}</span>
      </div>
    </div>
  )
}

// ─── 数字の桁パディング ────────────────────────────────────

/** 数値を指定桁数の0埋め文字列に。undefinedはダッシュでマスク（該当データなし） */
function pad(n: number | undefined, width: number): string {
  if (n === undefined) return "-".repeat(width)
  return String(Math.max(0, Math.trunc(n))).padStart(width, "0").slice(-width)
}

// ─── 数字バンク（複数桁のFlapDigitをまとめる） ─────────────

function DigitBank({ value, animate }: { value: string; animate: boolean }) {
  return (
    <span className="flap-digit-bank">
      {value.split("").map((c, i) => (
        <FlapDigit key={i} char={c} animate={animate} />
      ))}
    </span>
  )
}

// ─── 1文字フラップ（本物の split-flap 機構） ────────────────
//
// 上下2分割の静止表示（top/bottom）の上に、値が変わった瞬間だけ
// 「直前の文字の上半分が倒れ、新しい文字の下半分が起き上がる」4層のリーフを重ねて
// 実物のフラップがめくれる動きを再現する。初回マウント時は空白から現在値へめくれる。
function FlapDigit({ char, animate }: { char: string; animate: boolean }) {
  const [display, setDisplay] = useState<string>(() => (animate ? " " : char))
  const [flipFrom, setFlipFrom] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (char === display) return

    if (!animate) {
      setDisplay(char)
      setFlipFrom(null)
      return
    }

    setFlipFrom(display)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setDisplay(char)
      setFlipFrom(null)
    }, 340)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // displayは直前値の参照にのみ使う。依存に加えるとアニメーション完了時の
    // setDisplay自体が再発火して無限ループになるため意図的に外している。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [char, animate])

  return (
    <span className="flap-digit">
      <span className="flap-digit-top"><span className="flap-digit-glyph">{display}</span></span>
      <span className="flap-digit-bottom"><span className="flap-digit-glyph">{display}</span></span>
      {flipFrom !== null && (
        <>
          <span className="flap-digit-leaf-front"><span className="flap-digit-glyph">{flipFrom}</span></span>
          <span className="flap-digit-leaf-back"><span className="flap-digit-glyph">{char}</span></span>
        </>
      )}
    </span>
  )
}
