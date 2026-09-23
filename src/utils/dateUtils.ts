import { Plant, PlantStatus } from '../types/plant';

/**
 * Returns today's date formatted as YYYY-MM-DD in local time.
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses YYYY-MM-DD string into a Date object set to local midnight.
 */
export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Formats a Date object to YYYY-MM-DD string.
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats YYYY-MM-DD to friendly human format, e.g. "Sep 20" or "Today".
 */
export function formatDisplayDate(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const today = getTodayDateString();
  if (dateStr === today) return 'Today';

  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);

  // Check if yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (formatDateToString(yesterday) === dateStr) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a target due date string to human readable format.
 */
export function formatDueDate(dateStr: string): string {
  const today = getTodayDateString();
  if (dateStr === today) return 'Today';

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (formatDateToString(tomorrow) === dateStr) return 'Tomorrow';

  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Calculates the full status of a plant based on watering frequency and last watered date.
 */
export function calculatePlantStatus(plant: Plant, currentTodayStr?: string): PlantStatus {
  const todayStr = currentTodayStr || getTodayDateString();
  const todayDate = parseDateString(todayStr);

  if (!plant.lastWateredDate) {
    return {
      state: 'never_watered',
      daysPassed: 999,
      daysRemaining: 0,
      daysOverdue: 999,
      statusText: 'Needs Water (Never watered)',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
      isWaterDue: true,
      progressPercent: 100,
      nextDueDateString: 'Immediate',
    };
  }

  const lastDate = parseDateString(plant.lastWateredDate);
  const diffTime = todayDate.getTime() - lastDate.getTime();
  const daysPassed = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Compute next due date
  const nextDueDate = new Date(lastDate);
  nextDueDate.setDate(nextDueDate.getDate() + plant.waterEveryDays);
  const nextDueDateString = formatDateToString(nextDueDate);

  const daysRemaining = plant.waterEveryDays - daysPassed;

  // Case 1: Watered today
  if (plant.lastWateredDate === todayStr) {
    return {
      state: 'watered_today',
      daysPassed: 0,
      daysRemaining: plant.waterEveryDays,
      daysOverdue: 0,
      statusText: 'Watered today! 💧',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      isWaterDue: false,
      progressPercent: 0,
      nextDueDateString: formatDueDate(nextDueDateString),
    };
  }

  // Case 2: Watered in the future (edge case safeguard)
  if (daysPassed < 0) {
    return {
      state: 'upcoming',
      daysPassed: 0,
      daysRemaining: plant.waterEveryDays,
      daysOverdue: 0,
      statusText: `Upcoming (Due ${formatDueDate(nextDueDateString)})`,
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      isWaterDue: false,
      progressPercent: 0,
      nextDueDateString: formatDueDate(nextDueDateString),
    };
  }

  // Case 3: Due today exactly (daysPassed === waterEveryDays)
  if (daysPassed === plant.waterEveryDays) {
    return {
      state: 'due_today',
      daysPassed,
      daysRemaining: 0,
      daysOverdue: 0,
      statusText: `Due today (Last: ${formatDisplayDate(plant.lastWateredDate)})`,
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      isWaterDue: true,
      progressPercent: 100,
      nextDueDateString: 'Today',
    };
  }

  // Case 4: Overdue (daysPassed > waterEveryDays)
  if (daysPassed > plant.waterEveryDays) {
    const overdueDays = daysPassed - plant.waterEveryDays;
    return {
      state: 'overdue',
      daysPassed,
      daysRemaining: 0,
      daysOverdue: overdueDays,
      statusText: `Overdue by ${overdueDays}d (Last: ${formatDisplayDate(plant.lastWateredDate)})`,
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      isWaterDue: true,
      progressPercent: 100,
      nextDueDateString: `${overdueDays}d overdue`,
    };
  }

  // Case 5: Upcoming (0 < daysPassed < waterEveryDays)
  const percent = Math.min(100, Math.round((daysPassed / plant.waterEveryDays) * 100));
  const remainingText = daysRemaining === 1 ? 'Due tomorrow' : `Due in ${daysRemaining} days`;

  return {
    state: 'upcoming',
    daysPassed,
    daysRemaining,
    daysOverdue: 0,
    statusText: `${remainingText} (${formatDueDate(nextDueDateString)})`,
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    isWaterDue: false,
    progressPercent: percent,
    nextDueDateString: formatDueDate(nextDueDateString),
  };
}
