import { Plant } from '../types/plant';
import { getTodayDateString, formatDateToString } from './dateUtils';

export const STORAGE_KEY = 'plant_tracker_data';

export const INITIAL_SAMPLE_PLANTS: Plant[] = [
  {
    id: `plant_${Date.now() - 30000}`,
    name: 'Monstera Deliciosa',
    location: 'Living Room',
    waterEveryDays: 7,
    lastWateredDate: (() => {
      // 9 days ago -> overdue
      const d = new Date();
      d.setDate(d.getDate() - 9);
      return formatDateToString(d);
    })(),
  },
  {
    id: `plant_${Date.now() - 20000}`,
    name: 'Snake Plant',
    location: 'Bedroom',
    waterEveryDays: 14,
    lastWateredDate: null, // Never watered
  },
  {
    id: `plant_${Date.now() - 10000}`,
    name: 'Golden Pothos',
    location: 'Kitchen Window',
    waterEveryDays: 7,
    lastWateredDate: getTodayDateString(), // Watered today
  },
  {
    id: `plant_${Date.now() - 5000}`,
    name: 'Peace Lily',
    location: 'Office Desk',
    waterEveryDays: 5,
    lastWateredDate: (() => {
      // 3 days ago -> upcoming (due in 2 days)
      const d = new Date();
      d.setDate(d.getDate() - 3);
      return formatDateToString(d);
    })(),
  },
];

/**
 * Retrieves plants from localStorage.
 */
export function getPlants(): Plant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(item => item && typeof item.id === 'string' && typeof item.name === 'string');
    }
    return [];
  } catch (err) {
    console.error('Failed to parse plant data from localStorage:', err);
    return [];
  }
}

/**
 * Saves plants to localStorage.
 */
export function savePlants(plants: Plant[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
  } catch (err) {
    console.error('Failed to save plant data to localStorage:', err);
  }
}

/**
 * Presets for quick onboarding selection.
 */
export const PLANT_PRESETS = [
  { name: 'Monstera', location: 'Living Room', waterEveryDays: 7, emoji: '🪴' },
  { name: 'Snake Plant', location: 'Bedroom', waterEveryDays: 14, emoji: '🌱' },
  { name: 'Pothos', location: 'Kitchen', waterEveryDays: 7, emoji: '🌿' },
  { name: 'Peace Lily', location: 'Office', waterEveryDays: 5, emoji: '🌸' },
  { name: 'Fiddle Leaf Fig', location: 'Living Room', waterEveryDays: 10, emoji: '🍃' },
  { name: 'Succulent', location: 'Sunny Sill', waterEveryDays: 21, emoji: '🌵' },
  { name: 'ZZ Plant', location: 'Hallway', waterEveryDays: 18, emoji: '🪴' },
  { name: 'Spider Plant', location: 'Bathroom', waterEveryDays: 7, emoji: '🌾' },
];

export const ROOM_PRESETS = [
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Office',
  'Bathroom',
  'Balcony / Patio',
  'Dining Room',
  'Sunroom',
];
