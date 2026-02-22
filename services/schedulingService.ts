
import { ActivityItem, AppointmentItem } from '../types';

export interface ScheduleConflict {
  item1: ActivityItem | AppointmentItem;
  item2: ActivityItem | AppointmentItem;
  type: 'activity-activity' | 'activity-appointment' | 'appointment-appointment';
}

function parseTimeToMinutes(timeStr: string): number {
  // Expected format: "HH:MM AM/PM" or "HH:MM"
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3]?.toUpperCase();

  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function checkConflicts(
  activities: ActivityItem[],
  appointments: AppointmentItem[]
): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];
  
  const allItems = [
    ...activities.map(a => ({ ...a, type: 'activity' as const, start: parseTimeToMinutes(a.time), end: parseTimeToMinutes(a.time) + (a.duration || 30) })),
    ...appointments.map(a => ({ ...a, type: 'appointment' as const, start: parseTimeToMinutes(a.time), end: parseTimeToMinutes(a.time) + (a.duration || 60) }))
  ];

  for (let i = 0; i < allItems.length; i++) {
    for (let j = i + 1; j < allItems.length; j++) {
      const item1 = allItems[i];
      const item2 = allItems[j];

      // Check if they are on the same date (if date is available)
      const date1 = 'date' in item1 ? item1.date : undefined;
      const date2 = 'date' in item2 ? item2.date : undefined;

      // If both have dates and they are different, no conflict
      if (date1 && date2 && date1 !== date2) continue;

      // Overlap check: start1 < end2 AND start2 < end1
      if (item1.start < item2.end && item2.start < item1.end) {
        conflicts.push({
          item1: activities.find(a => a.id === item1.id) || appointments.find(a => a.id === item1.id)!,
          item2: activities.find(a => a.id === item2.id) || appointments.find(a => a.id === item2.id)!,
          type: `${item1.type}-${item2.type}` as any
        });
      }
    }
  }

  return conflicts;
}
