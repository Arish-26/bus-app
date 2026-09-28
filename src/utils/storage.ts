import AsyncStorage from '@react-native-async-storage/async-storage';

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

// 50 Tiruvannamalai District & Regional Routes for Shanmuga Industries Arts and Science College
const BUS_ROUTES: string[] = [
  'Polur ➔ Campus',
  'Chengam ➔ Campus',
  'Kilpennathur ➔ Campus',
  'Avalurpet ➔ Campus',
  'Desur ➔ Campus',
  'Gingee ➔ Campus',
  'Thirukoilur ➔ Campus',
  'Vettavalam ➔ Campus',
  'Manalurpet ➔ Campus',
  'Kalasapakkam ➔ Campus',
  'Veraiyur ➔ Campus',
  'Kandamangalam ➔ Campus',
  'Arani ➔ Campus',
  'Vandavasi ➔ Campus',
  'Cheyyar ➔ Campus',
  'Sathanur Dam ➔ Campus',
  'Thanipadi ➔ Campus',
  'Sankarapuram ➔ Campus',
  'Kallakurichi ➔ Campus',
  'Villupuram ➔ Campus',
  'Tindivanam ➔ Campus',
  'Kanchipuram ➔ Campus',
  'Vellore ➔ Campus',
  'Gudiyattam ➔ Campus',
  'Ambur ➔ Campus',
  'Vaniyambadi ➔ Campus',
  'Tirupattur ➔ Campus',
  'Harur ➔ Campus',
  'Uttangarai ➔ Campus',
  'Dharmapuri ➔ Campus',
  'Salem ➔ Campus',
  'Pondicherry ➔ Campus',
  'Cuddalore ➔ Campus',
  'Panruti ➔ Campus',
  'Neyveli ➔ Campus',
  'Vriddhachalam ➔ Campus',
  'Ulundurpet ➔ Campus',
  'Elavanasur ➔ Campus',
  'Rishivandiyam ➔ Campus',
  'Sembadavanur ➔ Campus',
  'Pudupalayam ➔ Campus',
  'Thurinjapuram ➔ Campus',
  'Naidu Mangalam ➔ Campus',
  'Vengikkal ➔ Campus',
  'Mathur ➔ Campus',
  'Mangalam ➔ Campus',
  'Anakkavoor ➔ Campus',
  'Thellar ➔ Campus',
  'Peranamallur ➔ Campus',
  'Chetpet ➔ Campus',
];

const DRIVER_NAMES: string[] = [
  'R. Kumar', 'M. Suresh', 'K. Ramesh', 'S. Murugan', 'A. Venkatesh',
  'P. Elumalai', 'G. Sekar', 'T. Rajan', 'V. Prakash', 'C. Balan',
  'D. Senthil', 'J. Mohan', 'K. Arumugam', 'N. Saravanan', 'M. Ganesan',
  'P. Manikandan', 'R. Vijay', 'S. Karthik', 'T. Dinesh', 'A. Anand',
  'V. Shankar', 'K. Palani', 'E. Selvam', 'R. Mani', 'M. Velu',
  'G. Pandian', 'P. Kuberan', 'S. Baskaran', 'T. Gopal', 'D. Sundar',
  'K. Natarajan', 'M. Murugesan', 'A. Radhakrishnan', 'V. Gunasekar', 'C. Krishnamoorthy',
  'E. Pachaiyappan', 'R. Govindan', 'S. Balasubramanian', 'T. Ramalingam', 'P. Jayabalan',
  'K. Srinivasan', 'M. Ramachandran', 'A. Dhanasekaran', 'V. Loganathan', 'C. Sambandam',
  'E. Thirunavukkarasu', 'R. Venkatesan', 'S. Jayaraman', 'T. Subramanian', 'P. Chandran'
];

export async function loadBuses(): Promise<Bus[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading buses from AsyncStorage:', e);
  }

  // Seed all 50 buses with Tiruvannamalai route locations & same dummy phone number
  const seed: Bus[] = [];
  for (let i = 1; i <= 50; i++) {
    const route = BUS_ROUTES[i - 1] || `Route ${i} ➔ Campus`;
    const driver = DRIVER_NAMES[i - 1] || `Driver ${i}`;
    seed.push({
      number: i,
      driver,
      contact: DEFAULT_CONTACT_NUMBER,
      route,
      photo: '',
    });
  }

  await saveBuses(seed);
  return seed;
}

export async function saveBuses(buses: Bus[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(buses));
  } catch (e) {
    console.error('Error saving buses to AsyncStorage:', e);
  }
}

export function hasDetails(bus: Bus): boolean {
  return Boolean(
    (bus.driver && bus.driver.trim().length > 0) ||
    (bus.contact && bus.contact.trim().length > 0) ||
    (bus.route && bus.route.trim().length > 0)
  );
}
