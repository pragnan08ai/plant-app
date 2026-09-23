export interface Plant {
  id: string;
  name: string;
  location: string;
  waterEveryDays: number;
  lastWateredDate: string | null; // "YYYY-MM-DD" or null
}

export interface PlantStatus {
  state: 'watered_today' | 'due_today' | 'overdue' | 'upcoming' | 'never_watered';
  daysPassed: number;
  daysRemaining: number;
  daysOverdue: number;
  statusText: string;
  badgeClass: string;
  isWaterDue: boolean;
  progressPercent: number; // 0 to 100% of cycle elapsed
  nextDueDateString: string;
}

export type FilterOption = 'all' | 'needs_water' | 'healthy';
export type SortOption = 'urgency' | 'name' | 'room' | 'frequency';
