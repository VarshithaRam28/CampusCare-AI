export const StorageKeys = {
  COMPLAINTS: 'campuscare_complaints',
  NOTIFICATIONS: 'campuscare_notifications',
  ROLE: 'campuscare_role',
} as const;

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return fallback;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export function clearStorage(): void {
  try {
    const keysToRemove = Object.values(StorageKeys);
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}
