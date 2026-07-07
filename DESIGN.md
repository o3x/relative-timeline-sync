# RelativeTimelineSync — 設計書 / 開発指示書

**最終更新: 2026-06-27**

---

## コンセプト

「今日のあなた」と「同じ年齢・同じ経過日数の偉人たち」を、  
空港の反転フラップ式案内表示機（ソラリボード）の形式で並べて見せるアプリ。

```
▌ 今日のあなた ▌
┌─────────────────────────────────────────────────────┐
│ 終日     │ ミーティング              │ あなた      │
│ 14:30   │ プレゼン資料提出          │ あなた      │
├─────────────────────────────────────────────────────┤
▌ 同じ経過日数の偉人たち (31歳 115日) ▌
│ 31歳0日  │ MACINTOSH LAUNCH        │ S.JOBS      │
│ 31歳2日  │ DON GIOVANNI PREMIERE   │ MOZART      │
└─────────────────────────────────────────────────────┘
```

---

## 画面フロー

```
起動
 └─ SplashScreen（2.2秒 → フェードアウト）
     ├─ 初回: SetupScreen（誕生日入力）
     └─ 2回目以降: MainBoard（直接）
```

---

## ファイル構成

```
src/
├── app/
│   ├── page.tsx          ← メインページ（状態管理・画面遷移）
│   ├── globals.css       ← Solariボード専用CSS（フリップアニメ等）
│   └── layout.tsx        ← ルートレイアウト
├── components/
│   ├── SplashScreen.tsx       ← App Store品質スプラッシュ
│   ├── TimeScopeBar.tsx       ← 今日/週/月/年/一生 + 比較モードトグル
│   ├── SplitFlapBoard.tsx     ← パタパタボード本体
│   └── SettingsPanel.tsx      ← 設定スライドインパネル
├── data/
│   └── presetPersons.ts  ← プリセット偉人データ（6名）
├── lib/
│   └── utils.ts          ← 日付計算・iCalパース・ボードアイテム生成
└── types/
    └── index.ts          ← 型定義
```

---

## データモデル

### 主要型

```typescript
type TimeScope = 'day' | 'week' | 'month' | 'year' | 'lifetime'
type CompareMode = 'days' | 'age'  // 同じ経過日数 or 同い年

interface CalendarEvent { id, date, startTime?, endTime?, title, isAllDay }
interface PersonalMilestone { id, date, title, description? }
interface FamousPerson { id, name, nameShort, birthDate, accentColor, events[] }
interface FamousPersonEvent { id, date, title, description? }
interface BoardItem { id, type, col1, col2, col3, accentColor?, subtext? }
```

### localStorage キー

| キー | 内容 |
|---|---|
| `rts_birthDate` | 誕生日 (YYYY-MM-DD) |
| `rts_quickMode` | アニメーションなし (boolean) |
| `rts_compareMode` | 比較モード ('days'|'age') |
| `rts_calendarEvents` | カレンダーイベント JSON |
| `rts_milestones` | 自分年表 JSON |
| `rts_famousPersons` | 偉人データ JSON |
| `rts_splashSeen` | スプラッシュ表示済み (未使用・将来用) |

---

## Solariボードのビジュアル設計

### カラーパレット（CSS変数）

| 変数 | 値 | 用途 |
|---|---|---|
| `--board-bg` | `#090704` | 最暗部背景 |
| `--board-panel` | `#141008` | パネル背景 |
| `--board-flap-top` | `#1c1610` | フラップ上半分 |
| `--board-flap-bot` | `#0f0c07` | フラップ下半分 |
| `--board-amber` | `#f0a422` | メインテキスト（琥珀色）|
| `--board-amber-dim` | `#7a5210` | 薄いテキスト |
| `--board-amber-glow` | `rgba(240,164,34,0.35)` | グロー効果 |

### フリップアニメーション (`flapFlipIn`)

```css
@keyframes flapFlipIn {
  0%   { transform: perspective(400px) rotateX(-88deg); opacity: 0.1; }
  55%  { transform: perspective(400px) rotateX(4deg);   opacity: 1; }
  75%  { transform: perspective(400px) rotateX(-1.5deg); }
  100% { transform: perspective(400px) rotateX(0deg);   opacity: 1; }
}
```

- 行ごとに `animationDelay: index * 55ms`（最大600ms）でずらして「パタパタ」感を演出
- React `key` を `${timeScope}-${compareMode}` にすることで、スコープ切替時に全行が再マウントされアニメーションが走る
- クイックモード時は `animation: none`

### ボードレイアウト（3カラム）

```
[col1: 日時・年齢 9rem] [col2: タイトル 1fr] [col3: 人物名 7rem]
```

- `col1`（今日モード）: `14:30` / `終日`
- `col1`（週・月モード）: `月 06.30`
- `col1`（偉人行）: `31歳 115日`
- `col3`（偉人行）: アクセントカラーで着色

---

## ボードアイテム生成ロジック (`getBoardItems`)

### スコープ別「自分の予定」フィルタ

| スコープ | 対象期間 |
|---|---|
| 今日 | 当日のみ（時刻順） |
| 週 | 今日〜6日後 |
| 月 | 当月 |
| 年 | 当年 |
| 一生 | 全期間 |

### スコープ別「偉人」ウィンドウ (経過日数モード)

| スコープ | ±日数ウィンドウ |
|---|---|
| 今日 | ±30日 |
| 週 | ±60日 |
| 月 | ±90日 |
| 年 | ±180日 |
| 一生 | 無制限 |

満年齢モードは同じ年齢± (日数ウィンドウ/365) 年。

---

## 未実装・今後の作業リスト

### 優先度: 高

- [ ] **UIビジュアル設計 (Claude Design)**: 現状はCSS変数で骨格のみ定義。フォント・余白・レイアウトの詳細をClaude Designで設計する
- [ ] **文字レベルのフリップアニメーション**: 現状は行単位。各文字が個別にパタパタ動く本格実装
- [ ] **モバイル対応**: 3カラムレイアウトがモバイルで崩れる → レスポンシブ化
- [ ] **サウンド**: フラップの「パタパタ」音（クリック音）の実装

### 優先度: 中

- [ ] **偉人データ拡充**: 現在6名。日本人偉人（坂本龍馬・夏目漱石・手塚治虫等）追加
- [ ] **スコープ別空状態の演出**: 「この期間の予定はありません」のときに偉人だけ表示するなど
- [ ] **Google Calendar連携**: 現状はiCal手動インポートのみ。URLからの自動取得（server/actions.ts は既存コードあり）
- [ ] **「今この瞬間と同じ時刻」モード**: 偉人が今日のこの時間に何をしていたか

### 優先度: 低

- [ ] **共有機能**: 「31歳のとき、S.JOBSはMacを発表していた」のカード画像生成
- [ ] **年齢プログレスバー**: 一生スコープで偉人の生涯と自分の位置を視覚化
- [ ] **PWA対応**: ホーム画面追加・オフライン動作

---

## 開発コマンド

```bash
cd /Users/ooyama/claude-work/RelativeTimelineSync
npm run dev     # 開発サーバー起動 (localhost:3000)
npm run build   # 本番ビルド
npm run lint    # ESLintチェック
```

---

## 注意事項

- `claude --print` は禁止（API課金発生のため）
- コメント・コミットメッセージは日本語
- ExtendScriptとは無関係（Next.js/React）
- `date-fns` の `ja` ロケールは現在未使用（必要に応じてimportして使う）
