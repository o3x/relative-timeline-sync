import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInCalendarDays, parseISO, addDays, format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateDaysAlive(birthDate: string, targetDate: Date = new Date()): number {
  const start = parseISO(birthDate);
  return differenceInCalendarDays(targetDate, start);
}

export function calculateRelativeDays(birthDate: string, eventDate: string): number {
  const start = parseISO(birthDate);
  const event = parseISO(eventDate);
  return differenceInCalendarDays(event, start);
}

export function getDateFromRelativeDay(birthDate: string, relativeDay: number): Date {
  const start = parseISO(birthDate);
  return addDays(start, relativeDay);
}

export function isSameMonthAndDay(date1: Date, date2: Date): boolean {
  return date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}

// export function formatDate already exists but linter says no? Checking...
// It seems I replaced it in a previous step! I need to re-add it.

export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    return format(parseISO(date), 'yyyy-MM-dd');
  }
  return format(date, 'yyyy-MM-dd');
}

import ICAL from "ical.js";
import { Event } from "@/types";

export function parseICS(fileContent: string): Event[] {
  try {
    const jcalData = ICAL.parse(fileContent);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents("vevent");

    return vevents.map((vevent: any, index: number) => {
      const event = new ICAL.Event(vevent);
      const summary = event.summary;
      const description = event.description;
      const startDate = event.startDate.toJSDate();

      return {
        id: `ics-${index}-${startDate.getTime()}`,
        date: format(startDate, 'yyyy-MM-dd'),
        title: summary,
        description: description || undefined,
        // age and relativeDays will be calculated later
      };
    });
  } catch (e) {
    console.error("Failed to parse ICS", e);
    return [];
  }
}
