
export enum ViewState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  ACTIVITIES = 'ACTIVITIES',
  ADD_ACTIVITY = 'ADD_ACTIVITY',
  ACTIVITY_DETAIL = 'ACTIVITY_DETAIL',
  MEDICATIONS = 'MEDICATIONS',
  ADD_MEDICATION = 'ADD_MEDICATION',
  UPDATE_MEDICATION = 'UPDATE_MEDICATION',
  APPOINTMENTS = 'APPOINTMENTS',
  ADD_APPOINTMENT = 'ADD_APPOINTMENT',
  RESCHEDULE_APPOINTMENT = 'RESCHEDULE_APPOINTMENT',
  ASSISTANT = 'ASSISTANT',
  ACCOUNT = 'ACCOUNT',
  SETTINGS = 'SETTINGS',
  LIFE_360 = 'LIFE_360',
  INJURY_LOG = 'INJURY_LOG',
  PATIENT_PORTAL = 'PATIENT_PORTAL',
  TODAY_DETAIL = 'TODAY_DETAIL',
  GAMES = 'GAMES'
}

export type UserRole = 'PATIENT' | 'CAREGIVER';

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  icon: string;
  date?: string;
  description?: string;
  location?: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency?: string;
  taken: boolean;
  color?: string; // For the bottle visual
  purpose?: string; // What the medication is for (e.g. "Cholesterol")
  type?: 'Tablet' | 'Capsule' | 'Liquid' | 'Cream';
  stockQuantity: number;
  maxQuantity: number;
  refillThreshold: number;
  doseAmount: number; // Amount subtracted per intake
}

export interface AppointmentItem {
  id: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  rating: number;
  favorite?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
