/**
 * SettingsPanel — 設定パネル（スライドイン）
 * 誕生日 / カレンダーiCal / 偉人管理 / クイックモード
 * Last Updated: Sat Jun 27 00:00:00 JST 2026
 */
"use client"

import { useRef, useState } from "react"
import { FamousPerson, FamousPersonEvent, CalendarEvent, PersonalMilestone } from "@/types"
import { parseICS, parseICSAsFamousEvents } from "@/lib/utils"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void

  birthDate: string
  onBirthDateChange: (date: string) => void

  quickMode: boolean
  onQuickModeChange: (v: boolean) => void

  calendarEvents: CalendarEvent[]
  onCalendarImport: (events: CalendarEvent[]) => void

  personalMilestones: PersonalMilestone[]
  onMilestonesChange: (ms: PersonalMilestone[]) => void

  famousPersons: FamousPerson[]
  onFamousPersonsChange: (persons: FamousPerson[]) => void
}

export function SettingsPanel({
  isOpen,
  onClose,
  birthDate,
  onBirthDateChange,
  quickMode,
  onQuickModeChange,
  calendarEvents,
  onCalendarImport,
  personalMilestones,
  onMilestonesChange,
  famousPersons,
  onFamousPersonsChange,
}: SettingsPanelProps) {
  return (
    <>
      {/* オーバーレイ */}
      {isOpen && (
        <div className="settings-overlay" onClick={onClose} />
      )}

      {/* パネル本体 */}
      <aside className={`settings-panel${isOpen ? "" : " closed"}`}>
        <div className="p-5 space-y-6">
          {/* ヘッダー */}
          <div className="flex items-center justify-between border-b border-[var(--board-border)] pb-3">
            <span className="text-[0.65rem] tracking-[0.2em] text-amber-dim">⚙ 設定</span>
            <button onClick={onClose} className="board-btn text-[0.65rem] px-2 py-1">
              ✕ 閉じる
            </button>
          </div>

          {/* 誕生日 */}
          <Section title="あなたの誕生日">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => onBirthDateChange(e.target.value)}
            />
          </Section>

          {/* アニメーション設定 */}
          <Section title="表示モード">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={quickMode}
                onChange={(e) => onQuickModeChange(e.target.checked)}
                className="accent-amber-400"
              />
              <span className="text-[0.75rem] text-amber-400">瞬間表示（アニメーションなし）</span>
            </label>
          </Section>

          {/* カレンダーインポート */}
          <Section title="カレンダー (.ics)">
            <ICalImport
              currentCount={calendarEvents.length}
              onImport={onCalendarImport}
              label="予定をインポート"
            />
          </Section>

          {/* 自分年表 */}
          <Section title="自分年表（手動）">
            <MilestoneEditor
              milestones={personalMilestones}
              onChange={onMilestonesChange}
            />
          </Section>

          {/* 偉人管理 */}
          <Section title="偉人データ">
            <FamousPersonManager
              persons={famousPersons}
              onChange={onFamousPersonsChange}
            />
          </Section>

          {/* データリセット */}
          <Section title="データ">
            <button
              className="board-btn text-[0.65rem] w-full"
              onClick={() => {
                if (confirm("すべてのデータをリセットしますか？")) {
                  localStorage.clear()
                  window.location.reload()
                }
              }}
            >
              全データをリセット
            </button>
          </Section>
        </div>
      </aside>
    </>
  )
}

// ─── セクションラッパー ─────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[0.6rem] tracking-[0.2em] text-amber-dim mb-2 pb-1 border-b border-[var(--board-border)]">
        {title.toUpperCase()}
      </div>
      {children}
    </div>
  )
}

// ─── iCalインポート ─────────────────────────────────────

interface ICalImportProps {
  currentCount: number
  onImport: (events: CalendarEvent[]) => void
  label: string
}

function ICalImport({ currentCount, onImport, label }: ICalImportProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  async function processFile(file: File) {
    if (!file.name.endsWith(".ics")) {
      alert(".icsファイルを選択してください")
      return
    }
    const text = await file.text()
    const events = parseICS(text)
    if (events.length === 0) {
      alert("イベントが見つかりませんでした")
      return
    }
    onImport(events)
  }

  return (
    <div>
      <div
        className={`border border-dashed border-[var(--board-border)] rounded p-4 text-center cursor-pointer transition-colors${isDragging ? " border-amber-400 bg-amber-400/5" : " hover:border-amber-700"}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault(); setIsDragging(false)
          if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0])
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".ics"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]) }}
        />
        <span className="text-[0.7rem] text-amber-dim">
          {currentCount > 0
            ? `✓ ${currentCount}件インポート済み / クリックで再インポート`
            : "クリックまたはドロップで .ics をインポート"}
        </span>
      </div>
    </div>
  )
}

// ─── 自分年表エディタ ────────────────────────────────────

interface MilestoneEditorProps {
  milestones: PersonalMilestone[]
  onChange: (ms: PersonalMilestone[]) => void
}

function MilestoneEditor({ milestones, onChange }: MilestoneEditorProps) {
  const [newDate, setNewDate] = useState("")
  const [newTitle, setNewTitle] = useState("")

  function add() {
    if (!newDate || !newTitle) return
    const ms: PersonalMilestone = {
      id: `ms-${Date.now()}`,
      date: newDate,
      title: newTitle,
    }
    onChange([...milestones, ms])
    setNewDate("")
    setNewTitle("")
  }

  function remove(id: string) {
    onChange(milestones.filter((m) => m.id !== id))
  }

  return (
    <div className="space-y-2">
      {milestones.length > 0 && (
        <ul className="space-y-1 max-h-36 overflow-y-auto">
          {milestones
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((ms) => (
              <li key={ms.id} className="flex items-center gap-2 text-[0.7rem]">
                <span className="text-amber-dim w-24 shrink-0">{ms.date}</span>
                <span className="text-amber flex-1 truncate">{ms.title}</span>
                <button
                  className="text-amber-dim hover:text-red-400 text-[0.6rem]"
                  onClick={() => remove(ms.id)}
                >
                  ✕
                </button>
              </li>
            ))}
        </ul>
      )}
      <div className="flex gap-1.5">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="w-32 text-[0.7rem]"
        />
        <input
          type="text"
          placeholder="出来事"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 text-[0.7rem]"
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button className="board-btn shrink-0" onClick={add}>+</button>
      </div>
    </div>
  )
}

// ─── 偉人管理 ────────────────────────────────────────────

const ACCENT_COLORS = [
  "#60a5fa", "#f87171", "#4ade80", "#c084fc", "#fbbf24", "#38bdf8", "#fb923c",
]

interface FamousPersonManagerProps {
  persons: FamousPerson[]
  onChange: (persons: FamousPerson[]) => void
}

function FamousPersonManager({ persons, onChange }: FamousPersonManagerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [addingNew, setAddingNew] = useState(false)
  const [newName, setNewName] = useState("")
  const [newBirth, setNewBirth] = useState("")

  function addPerson() {
    if (!newName || !newBirth) return
    const id = `person-${Date.now()}`
    const colorIdx = persons.length % ACCENT_COLORS.length
    const shortName = newName.split(" ").map(w => w[0]).join(".").toUpperCase().slice(0, 8)
    const person: FamousPerson = {
      id,
      name: newName,
      nameShort: shortName,
      birthDate: newBirth,
      accentColor: ACCENT_COLORS[colorIdx],
      events: [],
    }
    onChange([...persons, person])
    setNewName("")
    setNewBirth("")
    setAddingNew(false)
    setExpandedId(id)
  }

  function removePerson(id: string) {
    onChange(persons.filter((p) => p.id !== id))
  }

  function updatePerson(updated: FamousPerson) {
    onChange(persons.map((p) => (p.id === updated.id ? updated : p)))
  }

  return (
    <div className="space-y-2">
      {persons.map((person) => (
        <PersonRow
          key={person.id}
          person={person}
          isExpanded={expandedId === person.id}
          onToggle={() => setExpandedId(expandedId === person.id ? null : person.id)}
          onRemove={() => removePerson(person.id)}
          onUpdate={updatePerson}
        />
      ))}

      {addingNew ? (
        <div className="border border-[var(--board-border)] p-3 rounded space-y-2">
          <input
            type="text"
            placeholder="名前"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="text-[0.7rem]"
          />
          <input
            type="date"
            value={newBirth}
            onChange={(e) => setNewBirth(e.target.value)}
            className="text-[0.7rem]"
          />
          <div className="flex gap-2">
            <button className="board-btn-primary board-btn flex-1" onClick={addPerson}>追加</button>
            <button className="board-btn flex-1" onClick={() => setAddingNew(false)}>キャンセル</button>
          </div>
        </div>
      ) : (
        <button
          className="board-btn w-full text-[0.7rem]"
          onClick={() => setAddingNew(true)}
        >
          + 偉人を追加
        </button>
      )}
    </div>
  )
}

// ─── 偉人1人の行 ─────────────────────────────────────────

interface PersonRowProps {
  person: FamousPerson
  isExpanded: boolean
  onToggle: () => void
  onRemove: () => void
  onUpdate: (p: FamousPerson) => void
}

function PersonRow({ person, isExpanded, onToggle, onRemove, onUpdate }: PersonRowProps) {
  const [newEvtDate, setNewEvtDate] = useState("")
  const [newEvtTitle, setNewEvtTitle] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  function addEvent() {
    if (!newEvtDate || !newEvtTitle) return
    const evt: FamousPersonEvent = {
      id: `evt-${Date.now()}`,
      date: newEvtDate,
      title: newEvtTitle,
    }
    onUpdate({ ...person, events: [...person.events, evt] })
    setNewEvtDate("")
    setNewEvtTitle("")
  }

  function removeEvent(id: string) {
    onUpdate({ ...person, events: person.events.filter((e) => e.id !== id) })
  }

  async function handleICSImport(file: File) {
    const text = await file.text()
    const events = parseICSAsFamousEvents(text)
    if (events.length === 0) { alert("イベントが見つかりませんでした"); return }
    onUpdate({ ...person, events: [...person.events, ...events] })
  }

  return (
    <div
      className="border border-[var(--board-border)] rounded overflow-hidden"
      style={{ borderLeftColor: person.accentColor, borderLeftWidth: 3 }}
    >
      {/* ヘッダー行 */}
      <div className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[var(--board-flap-top)]" onClick={onToggle}>
        <span className="text-[0.7rem] flex-1" style={{ color: person.accentColor }}>
          {person.nameShort}
        </span>
        <span className="text-[0.65rem] text-amber-dim">{person.name}</span>
        <span className="text-[0.65rem] text-amber-dim">{person.events.length}件</span>
        <span className="text-amber-dim text-[0.65rem]">{isExpanded ? "▲" : "▼"}</span>
        <button
          className="text-[0.6rem] text-amber-dim hover:text-red-400 ml-1"
          onClick={(e) => { e.stopPropagation(); onRemove() }}
        >
          ✕
        </button>
      </div>

      {/* 展開エリア */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-[var(--board-border)]">
          {/* 既存イベント */}
          {person.events.length > 0 && (
            <ul className="space-y-1 max-h-32 overflow-y-auto pt-2">
              {person.events
                .slice()
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((evt) => (
                  <li key={evt.id} className="flex items-center gap-2 text-[0.65rem]">
                    <span className="text-amber-dim w-20 shrink-0">{evt.date}</span>
                    <span className="text-amber flex-1 truncate">{evt.title}</span>
                    <button
                      className="text-amber-dim hover:text-red-400"
                      onClick={() => removeEvent(evt.id)}
                    >✕</button>
                  </li>
                ))}
            </ul>
          )}

          {/* 手動追加フォーム */}
          <div className="flex gap-1 pt-1">
            <input
              type="date"
              value={newEvtDate}
              onChange={(e) => setNewEvtDate(e.target.value)}
              className="w-28 text-[0.65rem]"
            />
            <input
              type="text"
              placeholder="出来事"
              value={newEvtTitle}
              onChange={(e) => setNewEvtTitle(e.target.value)}
              className="flex-1 text-[0.65rem]"
              onKeyDown={(e) => e.key === "Enter" && addEvent()}
            />
            <button className="board-btn shrink-0" onClick={addEvent}>+</button>
          </div>

          {/* iCalインポート */}
          <div>
            <input
              ref={fileRef}
              type="file"
              accept=".ics"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) handleICSImport(e.target.files[0]) }}
            />
            <button
              className="board-btn w-full text-[0.65rem]"
              onClick={() => fileRef.current?.click()}
            >
              iCalで出来事をインポート (.ics)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
