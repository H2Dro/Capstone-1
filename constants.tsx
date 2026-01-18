
import React from 'react';
import { ActivityItem, MedicationItem, AppointmentItem } from './types';

export const MOCK_ACTIVITIES: ActivityItem[] = [
  { 
    id: '1', 
    title: 'Morning Service', 
    time: '10:00 AM', 
    icon: 'church',
    location: 'Community Chapel',
    description: 'A peaceful gathering for prayer and community singing. It is a great way to start the morning with friends and reflection. Please bring your favorite hymnal if you have one.'
  },
  { 
    id: '2', 
    title: 'Swimming Class', 
    time: '2:00 PM', 
    icon: 'pool',
    location: 'Aquatic Center',
    description: 'Low-impact water aerobics designed for seniors. Helps with joint mobility and cardiovascular health in a fun, social environment. Remember to bring a towel and a bottle of water!'
  },
];

export const MOCK_MEDICATIONS: MedicationItem[] = [
  { 
    id: '1', name: 'Lisinopril', dosage: '10mg', time: '8:00 AM', taken: true, 
    purpose: 'Blood Pressure', type: 'Tablet', stockQuantity: 24, maxQuantity: 30, refillThreshold: 5, doseAmount: 1
  },
  { 
    id: '2', name: 'Metformin', dosage: '500mg', time: '12:00 PM', taken: false, 
    purpose: 'Diabetes', type: 'Tablet', stockQuantity: 4, maxQuantity: 60, refillThreshold: 10, doseAmount: 2
  },
  { 
    id: '3', name: 'Simvastatin', dosage: '20mg', time: '8:00 PM', taken: false, 
    purpose: 'Cholesterol', type: 'Tablet', stockQuantity: 28, maxQuantity: 30, refillThreshold: 5, doseAmount: 1
  },
  { 
    id: '4', name: 'Omega-3', dosage: '1000mg', time: '8:00 AM', taken: true, 
    purpose: 'Supplements', type: 'Capsule', stockQuantity: 45, maxQuantity: 90, refillThreshold: 15, doseAmount: 1
  },
  { 
    id: '5', name: 'Cough Syrup', dosage: '10ml', time: '9:00 PM', taken: false, 
    purpose: 'Cold', type: 'Liquid', stockQuantity: 120, maxQuantity: 250, refillThreshold: 50, doseAmount: 10
  },
];

export const MOCK_APPOINTMENTS: AppointmentItem[] = [
  { 
    id: '1', 
    doctorName: 'Andrew Smith', 
    specialty: 'Cardiologist', 
    hospital: 'ABC Hospital',
    date: '5 Oct', 
    time: '10:30am - 5:30pm',
    rating: 4.8,
    favorite: true
  },
  { 
    id: '2', 
    doctorName: 'Jennifer Miller', 
    specialty: 'Neurologist', 
    hospital: 'Mercy Hospital',
    date: '6 Oct', 
    time: '10:30am - 5:30pm',
    rating: 4.9,
    favorite: false
  },
];

export const THEME_COLORS = {
  primaryDark: '#4F46E5', // Indigo 600
  primaryLight: '#818CF8', // Indigo 400
  textDark: '#1E293B', // Slate 800
  textLight: '#F8FAFC', // Slate 50
  accent: '#A855F7', // Purple 500
};
