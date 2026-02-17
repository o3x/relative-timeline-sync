# Relative Timeline Sync

自分の人生の「経過日数」を歴史上の偉人や尊敬する人物と同期させ、比較・体験するためのWebアプリケーション。

## コンセプト
「絶対的な日付」ではなく「生まれてからの経過日数」で人生を捉え直すことで、新しい視点を提供します。

## 主な機能
1. **My Timeline**: Googleカレンダーから取り込んだイベントを、美しい年表形式で振り返ります。
    - **Zoom**: ピンチ操作やスライダーで、詳細表示と全体俯瞰（ドットモード）を切り替え可能。
    - **On This Day**: 「1年前の今日」「10年前の今日」の出来事をトップに表示。
2. **Timeline Sync**: 自分の生年月日を入力すると、偉人の同じ時期（経過日数）のイベントと比較できます。
    - **Overlay**: 自分の年表上に偉人のイベントを重ねて表示し、同年齢の時の活動を比較。

## 対応フォーマット & インポート方法
- **File Upload**: `.ics` ファイル（Googleカレンダーのエクスポートファイルなど）をドラッグ＆ドロップ。
- **URL Import**: Googleカレンダー設定の「iCal形式の非公開URL」などを入力して直接同期。

### Googleカレンダーからのエクスポート手順
1. Googleカレンダーの「設定」>「インポート / エクスポート」>「エクスポート」からZIPをダウンロード。
2. 解凍した `.ics` ファイルをアップロード。
3. または、カレンダーごとの設定にある「iCal形式の非公開URL」をコピーして、URL Importタブに入力。

## 技術スタック
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Icons**: Lucide React
- **Utils**: date-fns, ical.js

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.
