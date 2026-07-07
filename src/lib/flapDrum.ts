/**
 * flapDrum — フラップドラムの経路計算（純関数）
 * 実物の反転フラップ式表示機は、面を綴じたドラムが一方向にしか回転できない。
 * 目標の面に達するまで中間の面をすべてめくる。その経路を計算する。
 * Last Updated: Tue Jul 07 20:04:51 JST 2026
 */

/** 数字ユニットのドラム。先頭の空白がホームポジション（初期面） */
export const DRUM_DIGIT: readonly string[] = [
  " ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-",
]

/**
 * from の「次の面」から to まで一方向に辿った経路を返す（to を含む）。
 * 例: pathBetween(DRUM_DIGIT, "3", "6") → ["4", "5", "6"]
 * 例: pathBetween(DRUM_DIGIT, "8", "1") → ["9", "-", " ", "0", "1"]（逆回転せず一周）
 *
 * - from === to のときは []（回転しない。実機もダイヤルが同じなら動かない）
 * - ドラムにない面が指定されたら [to]（1回でめくる従来動作へフォールバック）
 * - maxSteps 指定時は経路の「先頭側」を間引いてクリップする。
 *   回転の出だしは高速で視認できないため、減速して止まる体感は保たれる。
 */
export function pathBetween(
  drum: readonly string[],
  from: string,
  to: string,
  maxSteps?: number
): string[] {
  if (from === to) return []

  const fromIndex = drum.indexOf(from)
  const toIndex = drum.indexOf(to)
  if (fromIndex === -1 || toIndex === -1) return [to]

  const n = drum.length
  const distance = (toIndex - fromIndex + n) % n // 1 〜 n-1

  let path: string[] = []
  for (let k = 1; k <= distance; k++) {
    path.push(drum[(fromIndex + k) % n])
  }

  if (maxSteps !== undefined && maxSteps > 0 && path.length > maxSteps) {
    path = path.slice(path.length - maxSteps)
  }
  return path
}
