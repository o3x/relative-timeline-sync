# CHANGELOG

## [0.5.0] - Tue Jul 07 21:01:03 JST 2026

### Added
- **本物の「パタパタ」ドラム式フリップアニメーション**（設計書: DESIGN-flip-animation.md）:
  - 実物の反転フラップ式表示機と同じく、目標の面まで中間の面を高速で次々にめくるドラム回転を実装。一方向にしか回転せず（9→2 は一周する）、桁ごとに経路長が違うためバラバラのタイミングで停止する
  - `lib/flapDrum.ts`: ドラムの一方向経路計算（純関数）。`npm test`（node --test・依存追加なし）でユニットテスト10件
  - `components/FlapUnit.tsx`: 数字・ワード共通の汎用フラップユニット。回転中の値再変更はキューを丸ごと差し替え（スコープ連打しても破綻しない）。タブ非アクティブ復帰時は目標面へ即時確定
  - **WHO / Description 列のセル全面ワードフラップ化**: 文字分解ではなく実物の大型フラップ方式。実データ（偉人バッジ・イベント名、上限30枚）を綴じたドラムが回り、回転中に他の偉人プレートやイベント名がチラチラ見える。回転は最大10枚にクリップ
  - 停止時のバウンド（受け座に当たって震える動き）・めくれ中の陰影・ユニットごとの±10%速度ゆらぎ
  - 回転タイミングは CSS 変数（`--flap-step-ms`・`--flap-word-step-ms`・`--flap-final-ms`）で調整可能。JS のタイマーも同じ変数を読む

### Changed
- OS の「動きを減らす」（prefers-reduced-motion）は quickMode の未設定時の初期値として尊重する方式に（強制ブロックはしない。設定パネルでアニメーションを明示 ON にすれば OS 設定より優先）

## [0.4.1] - Tue Jul 07 17:51:55 JST 2026

### Removed
- **v0.4.0 UI刷新の置き去りdead code一掃（約1,200行）**: 旧UI（Timeline・ComparisonView・StatsCard・DateInput・CalendarImport）、shadcn ui全7ファイル、mockData、`server/actions.ts`を削除。`server/actions.ts`は任意URLをサーバー側でfetchするServer Action（潜在的SSRF経路）だったが、唯一の呼び出し元が上記のdeadなCalendarImportだったため、削除によりこの経路ごと除去した。未使用依存5個（@radix-ui/react-slider・react-slot・react-tabs・radix-ui・class-variance-authority）も削除
- **middleware.ts の削除**: `matcher: []`のno-opで実質何もしていなかった残骸を削除（Next 16のdeprecation警告も解消）

### Fixed
- **偉人イベントが近い順に並ばないバグ**: 「近い順にソート」の実装がno-opで、データ定義順のまま表示されていたのを修正
- React state配列のin-place破壊的ソートを修正（lifetime表示時）
- ボードが毎秒再計算・再レンダーされていたのを解消（時計とボードの依存を分離）
- README のBasic認証・URL Importに関する実態と乖離した記述を修正
- lintエラー・警告を全解消

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
