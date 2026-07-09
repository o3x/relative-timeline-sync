/**
 * SplitFlapBoard — 反転フラップ式案内表示機ボード
 * 実物の空港掲示板と同じく YEARS｜DAYS｜WHO｜Description｜YYYY｜MM｜DD の7列構成。
 * 数字列は1文字ずつの小型フラップ、WHO / Description はセル全面の大型フラップ。
 * どちらもドラム式（FlapUnit）: 目標面まで中間の面を高速でめくって停止する。
 * Last Updated: Thu Jul 09 20:02:56 JST 2026
 */
"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { BoardItem } from "@/types"
import { WordDrums } from "@/lib/utils"
import { DRUM_DIGIT } from "@/lib/flapDrum"
import { FlapUnit } from "@/components/FlapUnit"

/** ワードドラムの回転は最大10枚（30枚フル回転は2秒超かかり長すぎるため） */
const WORD_MAX_STEPS = 10

/** タブ/スコープ切替時、1行ずつ上から順にめくり始めるまでの間隔 */
const ROW_STAGGER_MS = 55

interface SplitFlapBoardProps {
  items: BoardItem[]
  wordDrums: WordDrums
  quickMode: boolean
}

/**
 * items が入れ替わった瞬間に全行へ一斉に反映せず、上の行から順番に
 * ROW_STAGGER_MS ずつ遅らせて反映する。各行はそれまでの表示（直前の面）を
 * 保ったままなので、実機の掲示板のように上から下へ「めくれが伝播していく」
 * 見た目になる。quickMode（アニメーションOFF）時は段階演出せず即時反映する。
 */
function useStaggeredItems(items: BoardItem[], animate: boolean): BoardItem[] {
  const [displayItems, setDisplayItems] = useState<BoardItem[]>(items)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    // 保留中の段階反映タイマーは常にリセット（タブ連打で前の演出が食い込まないように）
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    if (!animate) {
      // quickMode: 段階演出をスキップし、propsの最新値へ即座に同期する
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayItems(items)
      return
    }

    // 行数が変わっても位置ベースでマージ: 新しい行が増えた分だけ即時表示し、
    // 既存の行(前回値)はこの後のタイマーで1行ずつ新しい値に置き換える。
    setDisplayItems((prev) => items.map((item, i) => prev[i] ?? item))

    items.forEach((item, i) => {
      const timer = setTimeout(() => {
        setDisplayItems((prev) => {
          if (prev[i] === item) return prev
          const next = prev.slice()
          next[i] = item
          return next
        })
      }, i * ROW_STAGGER_MS)
      timersRef.current.push(timer)
    })

    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [items, animate])

  return displayItems
}

export function SplitFlapBoard({ items, wordDrums, quickMode }: SplitFlapBoardProps) {
  // OSの「動きを減らす」設定は quickMode の初期値として反映される（page.tsx）。
  // ここで強制ブロックはしない: パタパタはこのアプリの本体なので、
  // ユーザーが設定で明示的にONにしたら OS 設定より優先する。
  const animate = !quickMode

  const displayItems = useStaggeredItems(items, animate)

  // ドラムの面キー配列と、WHO面キー→アクセントカラーの引き当て
  const whoKeys = useMemo(() => wordDrums.who.map((f) => f.key), [wordDrums])
  const whoColors = useMemo(() => {
    const m = new Map<string, string>()
    for (const f of wordDrums.who) {
      if (f.accentColor) m.set(f.key, f.accentColor)
    }
    return m
  }, [wordDrums])

  if (displayItems.length === 0) {
    return <EmptyRow message="( イベントがありません。設定からカレンダーをインポートしてください。)" />
  }

  return (
    <div>
      {displayItems.map((item, index) => (
        // 位置ベースのkey: scope/compareMode切替でも同じマス(位置)のDOMを再利用し、
        // FlapUnitが「直前の面→新しい面」の差分を検知して本物のようにめくれさせる。
        <FlapRow
          key={index}
          item={item}
          whoKeys={whoKeys}
          whoColors={whoColors}
          descKeys={wordDrums.desc}
          animate={animate}
        />
      ))}
    </div>
  )
}

// ─── 個別フラップ行 ───────────────────────────────────────

interface FlapRowProps {
  item: BoardItem
  whoKeys: string[]
  whoColors: Map<string, string>
  descKeys: string[]
  animate: boolean
}

function FlapRow({ item, whoKeys, whoColors, descKeys, animate }: FlapRowProps) {
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
        <FlapUnit
          value={item.who}
          drum={whoKeys}
          renderFace={(key) => <WhoFace name={key} color={whoColors.get(key)} />}
          className="flap-word flap-word-who"
          stepMsVar="--flap-word-step-ms"
          stepMsFallback={110}
          maxSteps={WORD_MAX_STEPS}
          animate={animate}
        />
      </div>

      <div className="flap-cell flap-cell-desc">
        <FlapUnit
          value={item.description}
          drum={descKeys}
          renderFace={(key) => <span className="flap-word-text">{key}</span>}
          className="flap-word flap-word-desc"
          stepMsVar="--flap-word-step-ms"
          stepMsFallback={110}
          maxSteps={WORD_MAX_STEPS}
          animate={animate}
        />
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

// ─── WHO 面（航空会社プレート風バッジ） ────────────────────

function WhoFace({ name, color }: { name: string; color?: string }) {
  if (!name) return null
  const isMe = name === "あなた"
  return (
    <span className="who-badge" style={{ background: isMe || !color ? undefined : color }}>
      {name}
    </span>
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

// ─── 数字バンク（複数桁の小型フラップをまとめる） ──────────

function DigitBank({ value, animate }: { value: string; animate: boolean }) {
  return (
    <span className="flap-digit-bank" role="text" aria-label={value.trim()}>
      {value.split("").map((c, i) => (
        <FlapUnit
          key={i}
          value={c}
          drum={DRUM_DIGIT}
          renderFace={(key) => key}
          className="flap-digit"
          stepMsVar="--flap-step-ms"
          stepMsFallback={80}
          animate={animate}
        />
      ))}
    </span>
  )
}
