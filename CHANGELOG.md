# CHANGELOG

## [0.4.0] - Sat Jun 27 23:59:00 JST 2026

### Added
- **スプリットフラップ表示板（パタパタボード）UIへの全面刷新**:
  - 空港や駅の反転フラップ式案内表示機（ソラリボード）を模したアンバー発光・パタパタフリップアニメーション付きの「メインボード」を実装しました。
  - レンダリングを最適化し、アニメーションなしの「クイックモード」をサポートしました。
- **スプラッシュ画面（SplashScreen）の追加**:
  - 起動時に映画の予告編やフライト出発を思わせる高品位なスプラッシュアニメーションを追加しました。
- **セットアップ画面（SetupScreen）の追加**:
  - 初回起動時、または誕生日リセット時にレトロフューチャーなカード形式で誕生日入力を促す画面を追加しました。
- **時間スコープバー（TimeScopeBar）の追加**:
  - 表示スコープを「今日」「今週」「今月」「今年」「一生」に切り替えるバーを実装しました。
  - 偉人との比較モード（「同じ経過日数」または「同い年」）をリアルタイムでトグル切り替え可能にしました。
- **設定スライドパネル（SettingsPanel）の追加**:
  - 誕生日変更、クイックモード切替、カレンダーICSインポート、自分年表の編集、比較対象の偉人データのカスタマイズを1箇所で行える設定スライドパネルを実装しました。
- **偉人プリセットデータの拡張**:
  - `presetPersons.ts` を追加し、スティーブ・ジョブズ、アインシュタイン、モーツァルトなど計6名のプリセット歴史的偉人を追加しました。

### Fixed
- **Turbopack / Webpack ビルドにおける lightningcss 読み込みバグの修正**:
  - Next.js が内部で注入する環境変数 `CSS_TRANSFORMER_WASM` の影響により、Turbopack/Webpackビルド時に WASM版の lightningcss (`../pkg`) が誤って要求され、`Cannot find module '../pkg'` でビルドエラーになる不具合を `next.config.ts` で環境変数を削除することで修正しました。

## [0.3.0] - Tue Feb 17 16:25:00 JST 2026

### Added
- **Timeline Zoom**: スライダーとピンチ操作によるタイムラインの表示密度変更機能
- **Comparison Overlay**: メインタイムライン上への偉人イベントの重ね合わせ表示
- **URL Import**: GoogleカレンダーのICSファイルをURLから直接取り込む機能
- **On This Day**: 「去年の今日」などの過去の同日イベントをハイライト表示
- **Design Update**: Glassmorphismを採用したモダンなUIへの刷新
- **Persistence**: 生年月日とカレンダーURLのローカル保存・自動読み込み機能
- **Security**: Basic認証 (Middleware) によるアクセス制限機能

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
