import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

export interface Bus {
  number: number;
  driver: string;
  contact: string;
  route: string;
  photo?: string;
}

const STORAGE_KEY = 'campus_buses_v5';

export const DEFAULT_BUS_IMG = require('../../assets/images/bus-image.jpg');
export const DEFAULT_CONTACT_NUMBER = '98765 43210';

export function generateInitialSeed(): Bus[] {
  const seed: Bus[] = [];
  for (let i = 1; i <= 50; i++) {
    seed.push({
      number: i,
      driver: '',
      contact: DEFAULT_CONTACT_NUMBER,
      route: '',
      photo: '',
    });
  }
  return seed;
}

export async function loadBuses(): Promise<Bus[]> {
  let localData: Bus[] | null = null;

  // 1. Load from local AsyncStorage cache first (Offline-first speed)
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localData = parsed;
      }
    }
  } catch (e) {
    console.error('Error loading buses from AsyncStorage:', e);
  }

  if (!localData) {
    localData = generateInitialSeed();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(localData));
  }

  // 2. Fetch latest cloud data from Supabase
  try {
    const { data, error } = await supabase
      .from('buses')
      .select('*')
      .order('number', { ascending: true });

    if (!error && data && data.length > 0) {
      const cloudBuses: Bus[] = data.map((item) => ({
        number: item.number,
        driver: item.driver || '',
        contact: item.contact || DEFAULT_CONTACT_NUMBER,
        route: item.route || '',
        photo: item.photo || '',
      }));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cloudBuses));
      return cloudBuses;
    }
  } catch (err) {
    console.warn('Supabase cloud fetch warning, returning local state:', err);
  }

  return localData;
}

export async function syncBusesToCloud(buses: Bus[]): Promise<void> {
  try {
    const rows = buses.map((b) => ({
      number: b.number,
      driver: b.driver,
      contact: b.contact,
      route: b.route,
      photo: b.photo || '',
    }));
    await supabase.from('buses').upsert(rows, { onConflict: 'number' });
  } catch (err) {
    console.warn('Supabase cloud sync warning:', err);
  }
}

export async function saveBuses(buses: Bus[]): Promise<void> {
  // 1. Save to local AsyncStorage
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(buses));
  } catch (e) {
    console.error('Error saving buses to AsyncStorage:', e);
  }

  // 2. Save to Supabase Cloud DB
  await syncBusesToCloud(buses);
}

export async function deleteBusFromCloud(busNumber: number): Promise<void> {
  try {
    await supabase.from('buses').delete().eq('number', busNumber);
  } catch (err) {
    console.warn('Supabase delete warning:', err);
  }
}

export function hasDetails(bus: Bus): boolean {
  return Boolean(
    (bus.driver && bus.driver.trim().length > 0) ||
    (bus.contact && bus.contact.trim().length > 0) ||
    (bus.route && bus.route.trim().length > 0)
  );
}
