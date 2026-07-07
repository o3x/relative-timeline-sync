import { useState } from 'react';
import { SettingsPanel } from 'relative-timeline-sync';
import { PRESET_FAMOUS_PERSONS } from '../../src/data/presetPersons';
import type { CalendarEvent, PersonalMilestone, FamousPerson } from '../../src/types';

const SAMPLE_CALENDAR: CalendarEvent[] = [
  { id: 'cal-1', date: '2026-07-08', title: 'チームミーティング', isAllDay: false, startTime: '10:00' },
  { id: 'cal-2', date: '2026-07-12', title: '健康診断', isAllDay: true },
];

const SAMPLE_MILESTONES: PersonalMilestone[] = [
  { id: 'ms-1', date: '2018-04-01', title: '入社' },
  { id: 'ms-2', date: '2022-09-15', title: '独立' },
];

export function Default() {
  const [birthDate, setBirthDate] = useState('1994-07-08');
  const [quickMode, setQuickMode] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(SAMPLE_CALENDAR);
  const [milestones, setMilestones] = useState<PersonalMilestone[]>(SAMPLE_MILESTONES);
  const [famousPersons, setFamousPersons] = useState<FamousPerson[]>(
    PRESET_FAMOUS_PERSONS.slice(0, 3),
  );

  return (
    // SettingsPanel は position:fixed のスライドインパネル。transform を持つ
    // このラッパーが CSS 上の containing block になり、fixed 要素がビューポート
    // 全体へ逃げずにこのカード内に収まる（サイズ0に潰れて空白キャプチャになるのを防ぐ）。
    <div style={{ position: 'relative', width: 520, height: 640, transform: 'translateZ(0)', overflow: 'hidden' }}>
      <SettingsPanel
        isOpen={true}
        onClose={() => {}}
        birthDate={birthDate}
        onBirthDateChange={setBirthDate}
        quickMode={quickMode}
        onQuickModeChange={setQuickMode}
        calendarEvents={calendarEvents}
        onCalendarImport={setCalendarEvents}
        personalMilestones={milestones}
        onMilestonesChange={setMilestones}
        famousPersons={famousPersons}
        onFamousPersonsChange={setFamousPersons}
      />
    </div>
  );
}
