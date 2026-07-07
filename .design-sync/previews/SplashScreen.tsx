import { SplashScreen } from 'relative-timeline-sync';

export function Default() {
  return (
    // SplashScreen は position:fixed; inset:0 のフルスクリーン演出。transform を持つ
    // このラッパーが containing block になり、fixed 要素がビューポート全体へ逃げず
    // このカード内に収まる（サイズ0に潰れて空白キャプチャになるのを防ぐ）。
    <div style={{ position: 'relative', width: 480, height: 420, transform: 'translateZ(0)', overflow: 'hidden' }}>
      <SplashScreen onComplete={() => {}} skip={false} />
    </div>
  );
}
