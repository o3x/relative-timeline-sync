/**
 * RelativeTimelineSync — ユーティリティ関数
 * Last Updated: Tue Jul 07 17:51:55 JST 2026
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  differenceInCalendarDays,
  parseISO,
  addDays,
  format,
} from "date-fns"
import ICAL from "ical.js"
import {
  CalendarEvent,
  FamousPerson,
  FamousPersonEvent,
  BoardItem,
  TimeScope,
  CompareMode,
  PersonalMilestone,
} from "@/types"

// ─── Tailwind ─────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── 日付計算 ─────────────────────────────────────────────

/** 生誕日から今日までの経過日数 */
export function calculateDaysAlive(birthDate: string, targetDate: Date = new Date()): number {
  return differenceInCalendarDays(targetDate, parseISO(birthDate))
}

/** 生誕日から任意日付までの経過日数 */
export function calculateRelativeDays(birthDate: string, eventDate: string): number {
  return differenceInCalendarDays(parseISO(eventDate), parseISO(birthDate))
}

/** 経過日数から年齢（満年齢）を取得 */
export function daysToAge(daysAlive: number): number {
  return Math.floor(daysAlive / 365.25)
}

/** 経過日数から年内日数（誕生日からの日数 % 365）を取得 */
export function daysWithinYear(daysAlive: number): number {
  return Math.floor(daysAlive % 365.25)
}

/** 年齢ラベル文字列 (例: "31歳 115日") */
export function formatAgeLabel(daysAlive: number): string {
  const years = daysToAge(daysAlive)
  const days = daysWithinYear(daysAlive)
  return `${years}歳 ${days}日`
}

/** ボード表示用の時刻 (例: "14:30") */
export function formatBoardTime(time?: string): string {
  return time ?? "終日"
}

/** カレンダーイベントの Description 列表示文字列（ボード行とワードドラムで共用） */
export function calendarEventDescription(ev: CalendarEvent): string {
  const timeLabel = ev.isAllDay ? "" : formatBoardTime(ev.startTime)
  return (timeLabel ? `${timeLabel} ${ev.title}` : ev.title).toUpperCase()
}

// ─── iCal パーサー ────────────────────────────────────────

/** .ics ファイルを CalendarEvent[] に変換 */
export function parseICS(fileContent: string): CalendarEvent[] {
  try {
    const jcalData = ICAL.parse(fileContent)
    const comp = new ICAL.Component(jcalData)
    const vevents = comp.getAllSubcomponents("vevent")

    return vevents.map((vevent, index: number) => {
      const event = new ICAL.Event(vevent)
      const summary = event.summary ?? "(無題)"
      const description = event.description

      const startDT = event.startDate
      const endDT = event.endDate
      const startJS = startDT.toJSDate()

      const isAllDay = startDT.isDate // ICAL.js: .isDate === true for DATE-only values

      let startTime: string | undefined
      let endTime: string | undefined
      if (!isAllDay) {
        startTime = format(startJS, "HH:mm")
        if (endDT) {
          endTime = format(endDT.toJSDate(), "HH:mm")
        }
      }

      return {
        id: `ics-${index}-${startJS.getTime()}`,
        date: format(startJS, "yyyy-MM-dd"),
        startTime,
        endTime,
        title: summary,
        description: description || undefined,
        isAllDay: !!isAllDay,
      } satisfies CalendarEvent
    })
  } catch (e) {
    console.error("ICSパース失敗", e)
    return []
  }
}

/** .ics を偉人イベント配列に変換（偉人用iCalインポート） */
export function parseICSAsFamousEvents(fileContent: string): FamousPersonEvent[] {
  const calEvents = parseICS(fileContent)
  return calEvents.map((e) => ({
    id: e.id,
    date: e.date,
    title: e.title,
    description: e.description,
  }))
}

// ─── ワードドラム構築 ─────────────────────────────────────

/** WHO 列ドラムの1面（バッジ表示に色が要る） */
export interface WhoFace {
  key: string          // 面キー = 表示文字列（nameShort / "あなた"）
  accentColor?: string
}

/** WHO / Description 列の大型フラップに綴じる面の固定順リスト */
export interface WordDrums {
  who: WhoFace[]
  desc: string[]
}

/** ワードドラムの上限枚数。実機のドラムが物理的に有限なのと同じ制約 */
const WORD_DRUM_MAX = 30

/**
 * WHO / Description 列のワードドラムを構築する。
 * スコープ切替では入力が変わらないため、ドラムの並び順は安定する
 * （同じ遷移は常に同じ回転量になり、機械の実在感が保たれる）。
 * ドラムに綴じられていない面が目標になった場合は FlapUnit 側が
 * 1回めくりにフォールバックするので、上限で切り詰めても破綻しない。
 */
export function buildWordDrums(
  famousPersons: FamousPerson[],
  calendarEvents: CalendarEvent[],
  milestones: PersonalMilestone[]
): WordDrums {
  // WHO: 空白（ホームポジション）→ あなた → 偉人（定義順）
  const who: WhoFace[] = [{ key: "" }, { key: "あなた" }]
  for (const p of famousPersons) {
    if (p.nameShort && !who.some((f) => f.key === p.nameShort)) {
      who.push({ key: p.nameShort, accentColor: p.accentColor })
    }
  }

  // Description: 空白 → 偉人イベント（プレート印刷済みの面のイメージ）→ 自分年表 → カレンダー
  const desc: string[] = [""]
  const pushFace = (s: string) => {
    if (desc.length >= WORD_DRUM_MAX) return
    if (s && !desc.includes(s)) desc.push(s)
  }
  for (const p of famousPersons) {
    for (const e of p.events) pushFace(e.title.toUpperCase())
  }
  for (const m of milestones) pushFace(m.title.toUpperCase())
  for (const e of calendarEvents) pushFace(calendarEventDescription(e))

  return { who, desc }
}

// ─── ボードアイテム生成 ───────────────────────────────────

interface GetBoardItemsParams {
  timeScope: TimeScope
  compareMode: CompareMode
  today: Date
  birthDate: string
  daysAlive: number
  calendarEvents: CalendarEvent[]
  personalMilestones: PersonalMilestone[]
  famousPersons: FamousPerson[]
}

/** タイムスコープ・比較モードに応じたボードアイテムを生成 */
export function getBoardItems(params: GetBoardItemsParams): BoardItem[] {
  const {
    timeScope,
    compareMode,
    today,
    birthDate,
    daysAlive,
    calendarEvents,
    personalMilestones,
    famousPersons,
  } = params

  const items: BoardItem[] = []
  const ageYears = daysToAge(daysAlive)

  // ── 自分のイベントを時間スコープでフィルタ ─────────────
  const myCalFiltered = filterMyCalendarEvents(calendarEvents, today, timeScope)
  const myMilestoneFiltered = filterMyMilestones(personalMilestones, today, birthDate, daysAlive, timeScope)

  // ── 自分のイベントセクション ───────────────────────────
  const hasMy = myCalFiltered.length > 0 || myMilestoneFiltered.length > 0
  if (hasMy) {
    items.push(makeSectionHeader(timeScopeLabel("my", timeScope)))

    for (const ev of myCalFiltered) {
      items.push({
        id: `my-cal-${ev.id}`,
        type: "my-calendar",
        who: "あなた",
        description: calendarEventDescription(ev),
        date: ev.date,
      })
    }

    for (const ms of myMilestoneFiltered) {
      const relDays = calculateRelativeDays(birthDate, ms.date)
      items.push({
        id: `my-ms-${ms.id}`,
        type: "my-milestone",
        years: daysToAge(relDays),
        days: daysWithinYear(relDays),
        who: "あなた",
        description: ms.title.toUpperCase(),
        date: ms.date,
      })
    }
  } else if (timeScope !== "lifetime") {
    items.push(makeSectionHeader(timeScopeLabel("my", timeScope)))
    items.push({
      id: "no-my-events",
      type: "empty",
      who: "",
      description: "( この期間の予定はありません )",
    })
  }

  // ── 偉人セクション ─────────────────────────────────────
  const famousItems = getFamousItems(famousPersons, daysAlive, ageYears, birthDate, compareMode, timeScope)

  if (famousItems.length > 0) {
    items.push(makeSectionHeader(compareMode === "days"
      ? `同じ経過日数の偉人たち (${formatAgeLabel(daysAlive)})`
      : `同い年の偉人たち (${ageYears}歳)`
    ))
    items.push(...famousItems)
  }

  return items
}

// ─── 内部ヘルパー ─────────────────────────────────────────

function makeSectionHeader(label: string): BoardItem {
  return {
    id: `section-${label}`,
    type: "section-header",
    who: "",
    description: label,
  }
}

function timeScopeLabel(who: "my", scope: TimeScope): string {
  switch (scope) {
    case "day":     return "今日のあなた"
    case "week":    return "今週のあなた"
    case "month":   return "今月のあなた"
    case "year":    return "今年のあなた"
    case "lifetime": return "あなたの人生"
  }
}

function filterMyCalendarEvents(
  events: CalendarEvent[],
  today: Date,
  scope: TimeScope
): CalendarEvent[] {
  const todayStr = format(today, "yyyy-MM-dd")

  switch (scope) {
    case "day":
      return events
        .filter((e) => e.date === todayStr)
        .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""))

    case "week": {
      const end = format(addDays(today, 6), "yyyy-MM-dd")
      return events
        .filter((e) => e.date >= todayStr && e.date <= end)
        .sort((a, b) => a.date.localeCompare(b.date))
    }

    case "month": {
      const m = format(today, "yyyy-MM")
      return events
        .filter((e) => e.date.startsWith(m))
        .sort((a, b) => a.date.localeCompare(b.date))
    }

    case "year": {
      const y = format(today, "yyyy")
      return events
        .filter((e) => e.date.startsWith(y))
        .sort((a, b) => a.date.localeCompare(b.date))
    }

    case "lifetime":
      return [...events].sort((a, b) => a.date.localeCompare(b.date))
  }
}

function filterMyMilestones(
  milestones: PersonalMilestone[],
  today: Date,
  birthDate: string,
  daysAlive: number,
  scope: TimeScope
): PersonalMilestone[] {
  const todayStr = format(today, "yyyy-MM-dd")

  switch (scope) {
    case "day":
      return milestones.filter((m) => m.date === todayStr)

    case "week": {
      const end = format(addDays(today, 6), "yyyy-MM-dd")
      return milestones
        .filter((m) => m.date >= todayStr && m.date <= end)
        .sort((a, b) => a.date.localeCompare(b.date))
    }

    case "month": {
      const month = format(today, "yyyy-MM")
      return milestones
        .filter((m) => m.date.startsWith(month))
        .sort((a, b) => a.date.localeCompare(b.date))
    }

    case "year": {
      const y = format(today, "yyyy")
      return milestones
        .filter((m) => m.date.startsWith(y))
        .sort((a, b) => a.date.localeCompare(b.date))
    }

    case "lifetime":
      return [...milestones].sort((a, b) => a.date.localeCompare(b.date))
  }
}

function getFamousItems(
  persons: FamousPerson[],
  myDaysAlive: number,
  myAgeYears: number,
  myBirthDate: string,
  compareMode: CompareMode,
  timeScope: TimeScope
): BoardItem[] {
  const entries: { item: BoardItem; delta: number }[] = []

  // スコープごとのウィンドウ（日数）
  const windowDays: Record<TimeScope, number> = {
    day:      30,
    week:     60,
    month:    90,
    year:     180,
    lifetime: Infinity,
  }
  const winDays = windowDays[timeScope]

  // 満年齢ウィンドウ
  const windowAge: Record<TimeScope, number> = {
    day:      0.5,
    week:     1,
    month:    2,
    year:     3,
    lifetime: Infinity,
  }
  const winAge = windowAge[timeScope]

  for (const person of persons) {
    for (const event of person.events) {
      const eventDaysFromBirth = calculateRelativeDays(person.birthDate, event.date)
      const eventAge = daysToAge(eventDaysFromBirth)

      let include = false
      let delta = 0

      if (compareMode === "days") {
        delta = eventDaysFromBirth - myDaysAlive
        include = winDays === Infinity || Math.abs(delta) <= winDays
      } else {
        const ageDiff = eventAge - myAgeYears
        delta = ageDiff * 365 // 表示用の近似日数差
        include = winAge === Infinity || Math.abs(ageDiff) <= winAge
      }

      if (!include) continue

      // 差分のサブテキスト
      let subtext: string | undefined
      if (compareMode === "days" && delta !== 0 && winDays !== Infinity) {
        const absDelta = Math.abs(delta)
        subtext = delta > 0
          ? `あなたより ${absDelta} 日後`
          : `あなたより ${absDelta} 日前`
      }

      entries.push({
        item: {
          id: `famous-${person.id}-${event.id}`,
          type: "famous",
          years: daysToAge(eventDaysFromBirth),
          days: daysWithinYear(eventDaysFromBirth),
          who: person.nameShort,
          description: event.title.toUpperCase(),
          date: event.date,
          accentColor: person.accentColor,
          subtext,
        },
        delta,
      })
    }
  }

  // 近い順にソート
  entries.sort((a, b) => Math.abs(a.delta) - Math.abs(b.delta))

  return entries.map((e) => e.item)
}
