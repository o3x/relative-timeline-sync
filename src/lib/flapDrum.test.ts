/**
 * flapDrum のユニットテスト（node:test / 依存追加なし）
 * 実行: npm test（node --test。Node 24 の型ストリップで .ts を直接実行）
 * Last Updated: Tue Jul 07 20:04:51 JST 2026
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { pathBetween, DRUM_DIGIT } from "./flapDrum.ts"

test("順方向: 3→6 は 4,5,6 を経由する", () => {
  assert.deepEqual(pathBetween(DRUM_DIGIT, "3", "6"), ["4", "5", "6"])
})

test("隣接: 0→1 は 1 のみ", () => {
  assert.deepEqual(pathBetween(DRUM_DIGIT, "0", "1"), ["1"])
})

test("一周: 8→1 は逆回転せず 9,-,空白,0,1 と回る", () => {
  assert.deepEqual(pathBetween(DRUM_DIGIT, "8", "1"), ["9", "-", " ", "0", "1"])
})

test("ホームポジションから: 空白→9 は 0〜9 の10枚", () => {
  const path = pathBetween(DRUM_DIGIT, " ", "9")
  assert.equal(path.length, 10)
  assert.equal(path[0], "0")
  assert.equal(path[path.length - 1], "9")
})

test("同一面: 5→5 は空配列（回転しない）", () => {
  assert.deepEqual(pathBetween(DRUM_DIGIT, "5", "5"), [])
})

test("ドラム外の from: [to] にフォールバック", () => {
  assert.deepEqual(pathBetween(DRUM_DIGIT, "X", "3"), ["3"])
})

test("ドラム外の to: [to] にフォールバック", () => {
  assert.deepEqual(pathBetween(DRUM_DIGIT, "3", "X"), ["X"])
})

test("maxSteps クリップ: 先頭側が間引かれ、末尾（目標）は保たれる", () => {
  const path = pathBetween(DRUM_DIGIT, " ", "9", 4)
  assert.deepEqual(path, ["6", "7", "8", "9"])
})

test("maxSteps が経路長以上ならクリップしない", () => {
  assert.deepEqual(pathBetween(DRUM_DIGIT, "3", "6", 10), ["4", "5", "6"])
})

test("ワードドラム: 実データの面キーでも同じ機構が動く", () => {
  const drum = ["", "あなた", "S.JOBS", "MOZART", "EINSTEIN"]
  assert.deepEqual(pathBetween(drum, "あなた", "MOZART"), ["S.JOBS", "MOZART"])
  // 一周（逆回転しない）
  assert.deepEqual(pathBetween(drum, "EINSTEIN", "あなた"), ["", "あなた"])
})
