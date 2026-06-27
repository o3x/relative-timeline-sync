/**
 * RelativeTimelineSync — メインページ
 * スプラッシュ → セットアップ → メインボード
 * Last Updated: Sat Jun 27 00:00:00 JST 2026
 */
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { SplashScreen } from "@/components/SplashScreen"
import { TimeScopeBar } from "@/components/TimeScopeBar"
import { SplitFlapBoard } from "@/components/SplitFlapBoard"
import { SettingsPanel } from "@/components/SettingsPanel"
import { PRESET_FAMOUS_PERSONS } from "@/data/presetPersons"
import {
  calculateDaysAlive,
  daysToAge,
  formatAgeLabel,
  getBoardItems,
  parseICS,
} from "@/lib/utils"
import {
  AppView,
  TimeScope,
  CompareMode,
  CalendarEvent,
  PersonalMilestone,
  FamousPerson,
} from "@/types"
import { format } from "date-fns"

// ─── ローカルストレージキー ────────────────────────────
const LS = {
  birthDate:        "rts_birthDate",
  quickMode:        "rts_quickMode",
  compareMode:      "rts_compareMode",
  calEvents:        "rts_calendarEvents",
  milestones:       "rts_milestones",
  famousPersons:    "rts_famousPersons",
  splashSeen:       "rts_splashSeen",
} as const

// ─── メインページ ─────────────────────────────────────

export default function Home() {
  // ── 画面状態
  const [view, setView] = useState<AppView>("splash")
  const [splashDone, setSplashDone] = useState(false)

  // ── ユーザー設定
  const [birthDate, setBirthDate] = useState<string>("")
  const [quickMode, setQuickMode] = useState(false)
  const [compareMode, setCompareMode] = useState<CompareMode>("days")
  const [timeScope, setTimeScope] = useState<TimeScope>("week")
  const [settingsOpen, setSettingsOpen] = useState(false)

  // ── データ
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [milestones, setMilestones] = useState<PersonalMilestone[]>([])
  const [famousPersons, setFamousPersons] = useState<FamousPerson[]>(PRESET_FAMOUS_PERSONS)

  // ── リアルタイム時計
  const [now, setNow] = useState(new Date())

  // ── localStorageから復元
  useEffect(() => {
    const bd = localStorage.getItem(LS.birthDate)
    if (bd) setBirthDate(bd)

    const qm = localStorage.getItem(LS.quickMode)
    if (qm) setQuickMode(qm === "true")

    const cm = localStorage.getItem(LS.compareMode)
    if (cm) setCompareMode(cm as CompareMode)

    const cal = localStorage.getItem(LS.calEvents)
    if (cal) {
      try { setCalendarEvents(JSON.parse(cal)) } catch {}
    }

    const ms = localStorage.getItem(LS.milestones)
    if (ms) {
      try { setMilestones(JSON.parse(ms)) } catch {}
    }

    const fp = localStorage.getItem(LS.famousPersons)
    if (fp) {
      try { setFamousPersons(JSON.parse(fp)) } catch {}
    }
  }, [])

  // ── リアルタイム時計更新（1秒ごと）
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // ── スプラッシュ完了後の画面遷移
  const handleSplashComplete = useCallback(() => {
    setSplashDone(true)
    const bd = localStorage.getItem(LS.birthDate)
    setView(bd ? "main" : "setup")
  }, [])

  // ── 誕生日確定
  const handleBirthDateSubmit = useCallback((date: string) => {
    setBirthDate(date)
    localStorage.setItem(LS.birthDate, date)
    setView("main")
  }, [])

  // ── カレンダーイベント更新
  const handleCalendarImport = useCallback((events: CalendarEvent[]) => {
    setCalendarEvents(events)
    localStorage.setItem(LS.calEvents, JSON.stringify(events))
  }, [])

  // ── マイルストーン更新
  const handleMilestonesChange = useCallback((ms: PersonalMilestone[]) => {
    setMilestones(ms)
    localStorage.setItem(LS.milestones, JSON.stringify(ms))
  }, [])

  // ── 偉人データ更新
  const handleFamousPersonsChange = useCallback((persons: FamousPerson[]) => {
    setFamousPersons(persons)
    localStorage.setItem(LS.famousPersons, JSON.stringify(persons))
  }, [])

  // ── quickMode/compareMode変更時に保存
  const handleQuickModeChange = useCallback((v: boolean) => {
    setQuickMode(v)
    localStorage.setItem(LS.quickMode, String(v))
  }, [])

  const handleCompareModeChange = useCallback((m: CompareMode) => {
    setCompareMode(m)
    localStorage.setItem(LS.compareMode, m)
  }, [])

  const handleBirthDateChange = useCallback((date: string) => {
    setBirthDate(date)
    localStorage.setItem(LS.birthDate, date)
  }, [])

  // ── 計算値
  const daysAlive = useMemo(() =>
    birthDate ? calculateDaysAlive(birthDate, now) : 0
  , [birthDate, now])

  const ageYears = useMemo(() => daysToAge(daysAlive), [daysAlive])
  const ageLabel = useMemo(() => formatAgeLabel(daysAlive), [daysAlive])

  // ── ボードアイテム生成
  const boardItems = useMemo(() => {
    if (!birthDate) return []
    return getBoardItems({
      timeScope,
      compareMode,
      today: now,
      birthDate,
      daysAlive,
      calendarEvents,
      personalMilestones: milestones,
      famousPersons,
    })
  }, [timeScope, compareMode, now, birthDate, daysAlive, calendarEvents, milestones, famousPersons])

  // animKey: スコープ/モード変更でフリップトリガー
  const animKey = `${timeScope}-${compareMode}`

  // ── 時計表示
  const clockStr = format(now, "HH:mm:ss")
  const dateStr  = format(now, "yyyy.MM.dd")
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"]
  const dayStr   = dayNames[now.getDay()]

  // ══════════════════════════════════════════════
  // レンダリング
  // ══════════════════════════════════════════════

  // スプラッシュ画面
  if (!splashDone) {
    return (
      <SplashScreen
        onComplete={handleSplashComplete}
        skip={false}
      />
    )
  }

  // セットアップ画面（誕生日未設定）
  if (view === "setup") {
    return <SetupScreen onSubmit={handleBirthDateSubmit} />
  }

  // ── メイン画面 ────────────────────────────────
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--board-bg)" }}>

      {/* ヘッダー */}
      <header className="board-header">
        <div>
          <div className="board-title">RELATIVE TIMELINE</div>
          <div className="board-subtitle">DEPARTURE BOARD — YOUR LIFE IN CONTEXT</div>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="board-clock">{clockStr}</div>
            <div className="board-date-small">{dayStr} {dateStr}</div>
          </div>
          <button
            className="board-btn text-[0.65rem] px-3"
            onClick={() => setSettingsOpen(true)}
          >
            ⚙
          </button>
        </div>
      </header>

      {/* 生涯ステータスバー */}
      {birthDate && (
        <div className="life-status-bar">
          <div className="life-stat">
            <span className="life-stat-label">現在</span>
            <span className="life-stat-value">{ageLabel}</span>
          </div>
          <div className="life-stat">
            <span className="life-stat-label">経過日数</span>
            <span className="life-stat-value">{daysAlive.toLocaleString()} 日目</span>
          </div>
          <div className="life-stat">
            <span className="life-stat-label">比較</span>
            <span className="life-stat-value">
              {compareMode === "days" ? "同じ経過日数" : `同い年（${ageYears}歳）`}
            </span>
          </div>
        </div>
      )}

      {/* スコープバー */}
      <div className="px-4 py-2.5 border-b border-[var(--board-border)]" style={{ background: "var(--board-bg)" }}>
        <TimeScopeBar
          scope={timeScope}
          onScopeChange={setTimeScope}
          compareMode={compareMode}
          onCompareModeChange={handleCompareModeChange}
        />
      </div>

      {/* メインボード */}
      <main className="flex-1 overflow-y-auto">
        <SplitFlapBoard
          items={boardItems}
          animKey={animKey}
          quickMode={quickMode}
        />
      </main>

      {/* 設定パネル */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        birthDate={birthDate}
        onBirthDateChange={handleBirthDateChange}
        quickMode={quickMode}
        onQuickModeChange={handleQuickModeChange}
        calendarEvents={calendarEvents}
        onCalendarImport={handleCalendarImport}
        personalMilestones={milestones}
        onMilestonesChange={handleMilestonesChange}
        famousPersons={famousPersons}
        onFamousPersonsChange={handleFamousPersonsChange}
      />
    </div>
  )
}

// ─── セットアップ画面 ──────────────────────────────────

function SetupScreen({ onSubmit }: { onSubmit: (date: string) => void }) {
  const [date, setDate] = useState("")
  const [error, setError] = useState("")

  function handleSubmit() {
    if (!date) { setError("誕生日を入力してください"); return }
    const d = new Date(date)
    if (isNaN(d.getTime()) || d > new Date()) {
      setError("正しい日付を入力してください")
      return
    }
    onSubmit(date)
  }

  return (
    <div className="setup-screen">
      <div className="setup-card">
        {/* タイトル */}
        <div className="mb-8 text-center">
          <div className="text-amber text-lg font-bold tracking-[0.25em] amber-glow">
            RELATIVE TIMELINE
          </div>
          <div className="text-[0.6rem] tracking-[0.15em] text-amber-dim mt-1">
            あなたの誕生日を教えてください
          </div>
        </div>

        {/* 誕生日入力 */}
        <div className="mb-4">
          <label>あなたの誕生日</label>
          <input
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setError("") }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
          {error && (
            <p className="text-red-400 text-[0.65rem] mt-1">{error}</p>
          )}
        </div>

        {/* ボタン */}
        <button
          className="board-btn board-btn-primary w-full mt-4"
          onClick={handleSubmit}
          disabled={!date}
        >
          ボードを開く
        </button>

        {/* 説明 */}
        <p className="text-[0.6rem] text-amber-dim mt-5 leading-relaxed text-center">
          誕生日はあなたのデバイスにのみ保存されます。<br />
          サーバーには送信されません。
        </p>
      </div>
    </div>
  )
}
