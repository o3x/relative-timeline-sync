import { useState } from 'react';
import { TimeScopeBar } from 'relative-timeline-sync';
import type { TimeScope, CompareMode } from '../../src/types';

export function Default() {
  const [scope, setScope] = useState<TimeScope>('week');
  const [compareMode, setCompareMode] = useState<CompareMode>('days');
  return (
    <TimeScopeBar
      scope={scope}
      onScopeChange={setScope}
      compareMode={compareMode}
      onCompareModeChange={setCompareMode}
    />
  );
}

export function Lifetime() {
  const [scope, setScope] = useState<TimeScope>('lifetime');
  const [compareMode, setCompareMode] = useState<CompareMode>('age');
  return (
    <TimeScopeBar
      scope={scope}
      onScopeChange={setScope}
      compareMode={compareMode}
      onCompareModeChange={setCompareMode}
    />
  );
}

export function Today() {
  const [scope, setScope] = useState<TimeScope>('day');
  const [compareMode, setCompareMode] = useState<CompareMode>('days');
  return (
    <TimeScopeBar
      scope={scope}
      onScopeChange={setScope}
      compareMode={compareMode}
      onCompareModeChange={setCompareMode}
    />
  );
}
