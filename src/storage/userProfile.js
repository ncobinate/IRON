import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'iron_user_profile';

export async function saveProfile(data) {
  const existing = await getProfile();
  await AsyncStorage.setItem(KEY, JSON.stringify({ ...existing, ...data }));
}

export async function getProfile() {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function clearProfile() {
  await AsyncStorage.removeItem(KEY);
}
