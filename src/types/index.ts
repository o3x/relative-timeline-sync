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

/** ボードに表示する1行分のデータ（空港フラップ掲示板の列構成） */
export interface BoardItem {
  id: string
  type: 'section-header' | 'my-calendar' | 'my-milestone' | 'famous' | 'empty'
  years?: number       // YEARS列（経過年数。該当なしはundefined）
  days?: number        // DAYS列（年内経過日数）
  who: string          // WHO列（人物短縮名 or "あなた"。見出し/空行では空文字）
  description: string  // Description列（イベントのタイトル・見出し・空状態メッセージ）
  date?: string        // YYYY/MM/DD列の元になる実日付 (YYYY-MM-DD)
  accentColor?: string
  subtext?: string  // 補足情報（例: "あなたより65日後"）
}

/** アプリ設定 */
export interface AppSettings {
  birthDate: string       // YYYY-MM-DD
  quickMode: boolean      // true = アニメーションなし
  compareMode: CompareMode
}
