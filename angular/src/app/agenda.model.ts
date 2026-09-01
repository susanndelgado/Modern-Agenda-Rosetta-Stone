export interface Moderator {
  lecturers: string[];
}

export interface AgendaSegment {
  id: number;
  name: string;
  time_start: string;
  time_end: string;
  moderator: Moderator;
}

export interface AgendaSubsection {
  id: number;
  name: string;
  moderator: Moderator;
  segments: AgendaSegment[];
}

export interface AgendaSection {
  id: number;
  name: string;
  time_start: string;
  time_end: string;
  moderator: Moderator;
  segments: AgendaSegment[];
  subsections: AgendaSubsection[];
}

export interface AgendaSession {
  id: number;
  name: string;

  session_date: string;
  session_day: string;

  session_type_id: number;
  session_type: string;

  session_category_id: number;
  session_category: string;

  specialty_ids: number[];
  specialties: string[];

  location_id: number;
  location: string;
  venue: string;

  accreditation: string;

  moderator: Moderator;

  sections: AgendaSection[];
}

export interface AgendaDay {
  date: string;
  day: string;
  name: string;
  sessions: AgendaSession[];
}