# CHANGELOG

## [0.3.0] - Tue Feb 17 16:25:00 JST 2026

### Added
- **Timeline Zoom**: スライダーとピンチ操作によるタイムラインの表示密度変更機能
- **Comparison Overlay**: メインタイムライン上への偉人イベントの重ね合わせ表示
- **URL Import**: GoogleカレンダーのICSファイルをURLから直接取り込む機能
- **On This Day**: 「去年の今日」などの過去の同日イベントをハイライト表示
- **Design Update**: Glassmorphismを採用したモダンなUIへの刷新

## [0.2.0] - Mon Feb 17 03:25:00 JST 2026

### Added
- Googleカレンダー (.ics) インポート機能の実装
- `ical.js` によるiCal形式のパース処理
- `CalendarImport` コンポーネント (Drag & Drop対応)
- インポートしたイベントを「My Life」タイムラインとして表示・比較する機能

### Changed
- アプリ名を "Antigravity" から "Relative Timeline Sync" に変更
- UIヘッダーおよびドキュメントの表記を修正

## [0.1.0] - Mon Feb 17 02:50:00 JST 2026

### Added
- プロジェクトの初期化 (Next.js, Tailwind CSS, shadcn/ui)
- 基本的なデータ構造の定義 (Person, Event)
- 日付計算ロジックの実装 (`calculateDaysAlive`, `calculateRelativeDays`)
- UIコンポーネントの実装 (`DateInput`, `StatsCard`, `Timeline`)
- モックデータの作成 (Steve Jobs, Elon Musk)
- MVPのメインページ実装
