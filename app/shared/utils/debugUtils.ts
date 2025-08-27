import AsyncStorage from '@react-native-async-storage/async-storage';


export const debugAsyncStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  console.log('AsyncStorage Keys:', keys);
  
  for (const key of keys) {
    const value = await AsyncStorage.getItem(key);
    console.log(`${key}:`, value);
  }
};

export const clearAsyncStorage = async (key:string) => {
  await AsyncStorage.removeItem(key);
};