/**
 * FlapUnit — 汎用フラップユニット（ドラム式・多段めくり）
 * FlapDigit（1文字）と FlapWord（セル全面）の共通機構。
 * 値が変わると pathBetween で経路を計算し、中間の面を1枚ずつ高速でめくって
 * 目標面で停止する（最後の1枚だけバウンド付きの停止イージング）。
 * Last Updated: Tue Jul 07 20:04:51 JST 2026
 */
"use client"

import { Fragment, ReactNode, useEffect, useRef, useState } from "react"
import { pathBetween } from "@/lib/flapDrum"

/** :root の CSS 変数から ms 値を読む（単位は ms 固定。DevTools での調整用） */
function readMsVar(name: string, fallback: number): number {
  if (typeof window === "undefined") return fallback
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name)
  const n = parseFloat(raw)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

interface FlapUnitProps {
  /** 目標のドラム面キー */
  value: string
  /** ドラム（面キーの固定順リスト）。先頭がホームポジション＝初期面 */
  drum: readonly string[]
  /** 面の描画（文字1つ／人物バッジ／イベント名） */
  renderFace: (key: string) => ReactNode
  /** "flap-digit" または "flap-word ..."（見た目はCSS側で分岐） */
  className: string
  /** 中間フラップ1枚の所要時間を持つ CSS 変数名 */
  stepMsVar: string
  /** CSS 変数が読めないときのフォールバック (ms) */
  stepMsFallback: number
  /** 経路長の上限（ワードドラム用。省略時は無制限） */
  maxSteps?: number
  /** false = 即時置換（quickMode / reduced-motion） */
  animate: boolean
}

interface LeafState {
  to: string
  final: boolean
  seq: number // CSSアニメーション再トリガー用の通し番号（keyに使う）
}

export function FlapUnit({
  value,
  drum,
  renderFace,
  className,
  stepMsVar,
  stepMsFallback,
  maxSteps,
  animate,
}: FlapUnitProps) {
  // display = 確定済みの表示面。leaf 表示中は「めくれる前の面」を指す
  const [display, setDisplay] = useState<string>(() => (animate ? drum[0] ?? value : value))
  const [leaf, setLeaf] = useState<LeafState | null>(null)

  const displayRef = useRef(display)
  const targetRef = useRef(value)
  const queueRef = useRef<string[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const seqRef = useRef(0)
  // 機械のムラ: ユニットごとに回転速度へ±10%のゆらぎ（マウント時に固定）
  const jitterRef = useRef(1 + (Math.random() - 0.5) * 0.2)

  useEffect(() => {
    targetRef.current = value

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    // 目標面まで確定させ、回転を止める
    const settle = (face: string) => {
      clearTimer()
      queueRef.current = []
      displayRef.current = face
      setDisplay(face)
      setLeaf(null)
    }

    const step = () => {
      const next = queueRef.current.shift()
      if (next === undefined) {
        setLeaf(null)
        return
      }
      const final = queueRef.current.length === 0
      const stepMs = readMsVar(stepMsVar, stepMsFallback) * jitterRef.current
      const finalMs = readMsVar("--flap-final-ms", 160)
      seqRef.current += 1
      setLeaf({ to: next, final, seq: seqRef.current })
      timerRef.current = setTimeout(() => {
        displayRef.current = next
        setDisplay(next)
        if (queueRef.current.length > 0) {
          step()
        } else {
          setLeaf(null)
        }
      }, final ? finalMs : stepMs)
    }

    if (!animate) {
      settle(value)
      return clearTimer
    }

    if (value !== displayRef.current || queueRef.current.length > 0) {
      // 回転中の再変更もここに落ちる。キューは差分マージせず丸ごと差し替え、
      // いま確定している面から新目標への経路を引き直す（実機のダイヤル再設定と同じ）
      clearTimer()
      queueRef.current = pathBetween(drum, displayRef.current, value, maxSteps)
      if (queueRef.current.length === 0) {
        setLeaf(null)
      } else {
        step()
      }
    }

    return clearTimer
    // drum・タイミング系は「値が変わった瞬間」にrefから読めばよく、
    // 依存に含めると回転中のドラム再構築でキューが破棄されてしまうため意図的に外す。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, animate])

  // タブ非アクティブ中は setTimeout が間引かれ、めくり途中で固まって見える。
  // 復帰時に回転中だったら目標面へ即時確定させる。
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== "visible") return
      if (queueRef.current.length === 0) return
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = null
      queueRef.current = []
      displayRef.current = targetRef.current
      setDisplay(targetRef.current)
      setLeaf(null)
    }
    document.addEventListener("visibilitychange", onVisible)
    return () => document.removeEventListener("visibilitychange", onVisible)
  }, [])

  // 実物の機構どおり:
  //   上窓 = めくれ中は「次の面」（前の面のフラップが倒れて既に見えている）
  //   下窓 = 確定面（起き上がるフラップが被さるまで見えている）
  //   leaf-front = 倒れていく前の面の上半分 / leaf-back = 起き上がる次の面の下半分
  const topFace = leaf ? leaf.to : display

  return (
    <span
      className={className}
      role="text"
      aria-label={value.trim() || undefined}
      style={{ "--flap-unit-ms": `calc(var(${stepMsVar}) * ${jitterRef.current.toFixed(3)})` } as React.CSSProperties}
    >
      <span className="flap-window flap-window-top" aria-hidden="true">
        <span className="flap-face">{renderFace(topFace)}</span>
      </span>
      <span className="flap-window flap-window-bottom" aria-hidden="true">
        <span className="flap-face">{renderFace(display)}</span>
      </span>
      {leaf !== null && (
        <Fragment key={leaf.seq}>
          <span
            className={`flap-window flap-leaf-front${leaf.final ? " flap-leaf-final" : ""}`}
            aria-hidden="true"
          >
            <span className="flap-face">{renderFace(display)}</span>
          </span>
          <span
            className={`flap-window flap-leaf-back${leaf.final ? " flap-leaf-final" : ""}`}
            aria-hidden="true"
          >
            <span className="flap-face">{renderFace(leaf.to)}</span>
          </span>
        </Fragment>
      )}
    </span>
  )
}
