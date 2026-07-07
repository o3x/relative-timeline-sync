import { SplitFlapBoard } from 'relative-timeline-sync';
import type { BoardItem } from '../../src/types';

const SAMPLE_ITEMS: BoardItem[] = [
  { id: 'sec-my', type: 'section-header', col1: '', col2: '今週のあなた', col3: '' },
  {
    id: 'my-cal-1',
    type: 'my-calendar',
    col1: '月 07.06',
    col2: 'チームミーティング',
    col3: 'あなた',
  },
  {
    id: 'my-ms-1',
    type: 'my-milestone',
    col1: '水 07.08',
    col2: '資格試験の申込締切',
    col3: 'あなた',
  },
  { id: 'sec-famous', type: 'section-header', col1: '', col2: '同じ経過日数の偉人たち (31歳 115日)', col3: '' },
  {
    id: 'famous-1',
    type: 'famous',
    col1: '31歳 115日',
    col2: 'Apple設立',
    col3: 'S.JOBS',
    accentColor: '#60a5fa',
    subtext: 'あなたより2日後',
  },
  {
    id: 'famous-2',
    type: 'famous',
    col1: '31歳 98日',
    col2: 'SpaceX設立',
    col3: 'E.MUSK',
    accentColor: '#f87171',
    subtext: 'あなたより19日前',
  },
  {
    id: 'famous-3',
    type: 'famous',
    col1: '31歳 140日',
    col2: 'ノーベル賞受賞',
    col3: 'M.CURIE',
    accentColor: '#4ade80',
    subtext: 'あなたより23日後',
  },
];

export function Default() {
  // quickMode=true で確定表示（アニメーション未使用）にしてスクリーンショットを安定させる
  return (
    <SplitFlapBoard items={SAMPLE_ITEMS} animKey="week-days" quickMode={true} />
  );
}

export function Animating() {
  // 実際のデフォルト挙動（パタパタアニメーション演出あり）。
  // マウント直後は行ごとに遅延した flapFlipIn が進行中のため、キャプチャタイミングによっては
  // 途中状態（低不透明度・回転）で写ることがある — 既知の非決定要素。
  return (
    <SplitFlapBoard items={SAMPLE_ITEMS} animKey="week-days-anim" quickMode={false} />
  );
}

export function Empty() {
  return <SplitFlapBoard items={[]} animKey="empty" quickMode={true} />;
}
