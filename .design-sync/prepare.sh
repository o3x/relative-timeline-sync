#!/bin/bash
# design-sync 用の準備スクリプト。
# 1) synth-entry 用のバレルファイル（componentSrcMap で列挙した4コンポーネントを再export）を生成
# 2) next build が出力するコンパイル済みCSS（Tailwind実クラス＋next/fontのフォント）を
#    design-sync の cssEntry 用に安定パスへコピー
# next build のチャンクファイル名はコンテンツハッシュ付きで毎回変わるため、
# design-sync 実行前に必ずこのスクリプトを再実行して .design-sync/.cache/ を更新すること。
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p .design-sync/.cache/css .design-sync/.cache/media

cat > .design-sync/.cache/entry.mjs <<'EOF'
export * from '../../src/components/SettingsPanel.tsx';
export * from '../../src/components/SplashScreen.tsx';
export * from '../../src/components/SplitFlapBoard.tsx';
export * from '../../src/components/TimeScopeBar.tsx';
EOF

rm -rf .design-sync/.cache/css .design-sync/.cache/media
mkdir -p .design-sync/.cache/css .design-sync/.cache/media

css_files=(.next/static/chunks/*.css)
if [ ! -e "${css_files[0]}" ]; then
  echo "error: .next/static/chunks/*.css not found — run 'npm run build' first" >&2
  exit 1
fi
cat "${css_files[@]}" > .design-sync/.cache/css/compiled.css

if [ -d .next/static/media ]; then
  cp .next/static/media/*.woff2 .design-sync/.cache/media/ 2>/dev/null || true
fi

echo "prepared entry.mjs + .design-sync/.cache/css/compiled.css ($(wc -c < .design-sync/.cache/css/compiled.css) bytes)"
