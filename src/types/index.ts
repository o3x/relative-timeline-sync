export interface Event {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description?: string;
  age?: number; // Age at the time of event
  relativeDays?: number; // Calculated field: days since birth
}

export interface Person {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  deathDate?: string; // YYYY-MM-DD
  description?: string;
  events: Event[];
  avatarUrl?: string;
  themeColor?: string;
}

export interface TimelineItem {
  day: number;
  events: {
    personId: string;
    event: Event;
  }[];
}
