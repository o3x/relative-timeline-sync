# design-sync メモ（RelativeTimelineSync）

## このリポジトリの特殊事情

RelativeTimelineSync は公開npmパッケージではなく単体のNext.jsアプリ。デザインシステム用の`dist/`ビルドは存在しないため、**synth-entry方式**（`.design-sync/config.json`の`entry`+`componentSrcMap`で明示的にバレルファイル経由）でコンポーネントを取り込んでいる。

対象は `src/components/` の4つ（`SettingsPanel`, `SplashScreen`, `SplitFlapBoard`, `TimeScopeBar`）。`src/app/layout.tsx`の`RootLayout`と`src/app/page.tsx`の`Home`はアプリ本体の組立てコンポーネントで単体プレビュー対象として不適切なため、`componentSrcMap`に含めず除外している（synth-entry全走査ではなく明示pinのみを使っているので、そもそもスキャン対象にならない）。

## PKG_DIR解決の罠

`--node-modules ./node_modules`だけでは`node_modules/relative-timeline-sync`が存在せず`exportedNames()`がENOENTでクラッシュする。`node_modules/relative-timeline-sync -> ..`のような自己参照シンボリックリンクを作ると、ts-morphのディレクトリ走査がシンボリックリンクを再帰して`ENAMETOOLONG`になる（実際に踏んだ）。

**解決策**: `cfg.entry`に repo 内の実ファイル（`.design-sync/.cache/entry.mjs`）を指定する。ENTRY_OVERRIDEがあると`PKG_DIR`はそのファイルから上に package.json を探して解決される（node_modules経由を迂回できる）。ただし`.d.ts`ベースの`exportedNames()`は空集合を返すので、コンポーネント一覧は`cfg.componentSrcMap`で明示的にpinする必要がある（synth-entryの全走査は`--entry`未指定時のみ有効）。

## CSSソース

`src/app/globals.css`は`@import "tailwindcss"`などTailwind v4の**未コンパイルソース**であり、実際のユーティリティクラスを含まない。`npm run build`（`next build`）が生成する`.next/static/chunks/*.css`が実際にコンパイルされたCSS（実クラス＋next/fontのフォント@font-face）。

**再sync時は必ず**:
```
npm run build && bash .design-sync/prepare.sh
```
を実行してから design-sync を回すこと（`cfg.buildCmd`に記載済み）。`prepare.sh`は
1. synth-entry用バレルファイル（`.design-sync/.cache/entry.mjs`）を生成
2. `.next/static/chunks/*.css` → `.design-sync/.cache/css/compiled.css` にコピー（Nextのチャンクファイル名はビルドごとにハッシュが変わるため、安定パスへ集約）
3. `.next/static/media/*.woff2` → `.design-sync/.cache/media/` にコピー（compiled.cssの`url(../media/...)`参照を解決するため）

## 固定位置(position:fixed)コンポーネントのプレビュー

`SettingsPanel`（右からのスライドインパネル）と`SplashScreen`（フルスクリーン演出）は実CSSで`position:fixed`。素の`cardMode:single`+`viewport`オーバーライドだけでは、`.ds-single`ラッパー自体が`height:auto`のまま高さ0に潰れ、fixed子要素の containing block も0×0になって**スクリーンショットが真っ白になった**（validateの`[RENDER_BLANK]`/`[RENDER_THIN]`で発覚）。

**解決策**: プレビュー`.tsx`側で `transform: 'translateZ(0)'` を持つ明示サイズのラッパー`<div>`で囲み、そのdivをfixed子要素のcontaining blockにした（`.design-sync/previews/SettingsPanel.tsx`, `SplashScreen.tsx`参照）。configの`cfg.overrides.<Name>.viewport`はプロダクト側カード表示サイズの指定であり、単体HTMLの検証描画のサイズ確保には別途プレビュー内ラッパーが必要、という点に注意。

## Known render warns（既知・非ブロッキングの見た目タイミング）

- **SplitFlapBoard「Animating」**: 実際のデフォルト挙動（`quickMode=false`）そのままのプレビュー。行ごとに`flapFlipIn`アニメーションが遅延実行されるため、キャプチャタイミング次第で行が半透明・回転途中の状態で写ることがある。壊れているのではなく、キャプチャの瞬間の問題。`Default`ストーリーは`quickMode=true`にして確定表示にしてある。
- **SplashScreen「Default」**: サブタイトル（`.splash-sub`）は`0.7秒遅延+0.7秒`のCSSフェードインのため、レンダーチェック/キャプチャのタイミングによっては写らない（アイコンとタイトルは常に写る）。実コンポーネントの演出仕様であり、プレビューの不備ではない。

## Re-sync risks（次回syncで見るべき点）

- `.design-sync/.cache/css/compiled.css`と`.design-sync/.cache/media/`は`npm run build`の結果に依存する生成物。ソース（Tailwindクラスの追加/削除、next/fontの設定変更）が変わったら必ず`bash .design-sync/prepare.sh`を再実行してから`resync.mjs`を回すこと。
- `.design-sync/.cache/entry.mjs`はコンポーネント4つを固定的に`export *`しているだけの手書き相当のバレル。`src/components/`に新規コンポーネントを追加した場合は、①`.design-sync/prepare.sh`のヒアドキュメントに`export *`行を追加、②`cfg.componentSrcMap`に追記、の両方が必要（自動検出されない）。
- `node_modules/relative-timeline-sync`のシンボリックリンクは作らないこと（無限再帰でビルドが壊れる）。
- SettingsPanel/SplashScreenのプレビューは`position:fixed`を意図的に閉じ込めるラッパーに依存しているので、実コンポーネントのCSSで`position:fixed`をやめる変更をした場合はプレビューのラッパーが不要になる（残しても実害はない）。
