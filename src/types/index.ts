/**
 * RelativeTimelineSync — 型定義
 * Last Updated: Sat Jun 27 00:00:00 JST 2026
 */

/** 時間スコープ: 今日・週・月・年・一生 */
export type TimeScope = 'day' | 'week' | 'month' | 'year' | 'lifetime'

/** 比較モード: 同じ経過日数 or 同い年（満年齢） */
export type CompareMode = 'days' | 'age'

/** アプリ画面状態 */
export type AppView = 'splash' | 'setup' | 'main'

/** カレンダーイベント（iCalからインポート） */
export interface CalendarEvent {
  id: string
  date: string        // YYYY-MM-DD
  startTime?: string  // HH:MM (24時間)
  endTime?: string    // HH:MM (24時間)
  title: string
  description?: string
  isAllDay: boolean
}

/** 自分年表の手動入力イベント */
export interface PersonalMilestone {
  id: string
  date: string  // YYYY-MM-DD
  title: string
  description?: string
}

/** 偉人の出来事 */
export interface FamousPersonEvent {
  id: string
  date: string  // YYYY-MM-DD（実際の日付）
  title: string
  description?: string
}

/** 偉人データ */
export interface FamousPerson {
  id: string
  name: string        // フルネーム (例: "スティーブ・ジョブズ")
  nameShort: string   // 短縮名 (例: "S.JOBS")
  birthDate: string   // YYYY-MM-DD
  deathDate?: string  // YYYY-MM-DD
  description?: string
  accentColor: string // CSSカラー（行のアクセント色）
  events: FamousPersonEvent[]
}

/** ボードに表示する1行分のデータ */
export interface BoardItem {
  id: string
  type: 'section-header' | 'my-calendar' | 'my-milestone' | 'famous' | 'empty'
  col1: string    // 日時・年齢列
  col2: string    // メインコンテンツ列
  col3: string    // 人物名列
  accentColor?: string
  subtext?: string  // 補足情報（例: "あなたより65日後"）
}

/** アプリ設定 */
export interface AppSettings {
  birthDate: string       // YYYY-MM-DD
  quickMode: boolean      // true = アニメーションなし
  compareMode: CompareMode
}

// ─── 旧型定義（CalendarImport互換用） ───────────────────────

export interface Event {
  id: string
  date: string
  title: string
  description?: string
  age?: number
  relativeDays?: number
}

export interface Person {
  id: string
  name: string
  birthDate: string
  deathDate?: string
  description?: string
  events: Event[]
  themeColor?: string
}
