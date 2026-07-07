import { SplitFlapBoard } from 'relative-timeline-sync';
import type { BoardItem } from '../../src/types';

const SAMPLE_ITEMS: BoardItem[] = [
  { id: 'sec-my', type: 'section-header', who: '', description: '今週のあなた' },
  {
    id: 'my-cal-1',
    type: 'my-calendar',
    who: 'あなた',
    description: 'チームミーティング',
    date: '2026-07-06',
  },
  {
    id: 'my-ms-1',
    type: 'my-milestone',
    years: 31,
    days: 364,
    who: 'あなた',
    description: '資格試験の申込締切',
    date: '2026-07-08',
  },
  { id: 'sec-famous', type: 'section-header', who: '', description: '同じ経過日数の偉人たち (31歳 364日)' },
  {
    id: 'famous-1',
    type: 'famous',
    years: 31,
    days: 366,
    who: 'S.JOBS',
    description: 'Apple設立',
    date: '1976-04-01',
    accentColor: '#60a5fa',
    subtext: 'あなたより2日後',
  },
  {
    id: 'famous-2',
    type: 'famous',
    years: 30,
    days: 312,
    who: 'E.MUSK',
    description: 'SpaceX設立',
    date: '2002-05-06',
    accentColor: '#f87171',
    subtext: 'あなたより19日前',
  },
  {
    id: 'famous-3',
    type: 'famous',
    years: 31,
    days: 49,
    who: 'M.CURIE',
    description: 'ラジウム発見',
    date: '1898-12-26',
    accentColor: '#4ade80',
    subtext: 'あなたより23日後',
  },
];

export function Default() {
  // quickMode=true で確定表示（アニメーション未使用）にしてスクリーンショットを安定させる
  return (
    <SplitFlapBoard items={SAMPLE_ITEMS} quickMode={true} />
  );
}

export function Animating() {
  // 実際のデフォルト挙動（1文字ずつフラップがめくれる演出あり）。
  // マウント直後は各FlapDigitが空白から値へめくれる途中のため、キャプチャタイミングによっては
  // 途中状態（回転中の文字）で写ることがある — 既知の非決定要素。
  return (
    <SplitFlapBoard items={SAMPLE_ITEMS} quickMode={false} />
  );
}

export function Empty() {
  return <SplitFlapBoard items={[]} quickMode={true} />;
}
