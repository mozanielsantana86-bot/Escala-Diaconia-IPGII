export interface Volunteer {
  id: string;
  name: string;
  phone: string; // Format: 5511999999999
}

export interface Shift {
  id: string;
  date: string; // YYYY-MM-DD
  time: '09:00' | '18:00';
  volunteerIds: string[];
}

export interface MonthData {
  year: number;
  month: number; // 0-11
  sundays: string[]; // Array of date strings
}

export interface VolunteerStats {
  volunteerId: string;
  count: number;
  status: 'pending' | 'ok' | 'excess';
}