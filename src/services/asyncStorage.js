import AsyncStorage from '@react-native-async-storage/async-storage';

export const setLocalStorageItem = async (key, value) => {
	await AsyncStorage.setItem(key, value);
};

export const getLocalStorageItem = async (key) => {
	return await AsyncStorage.getItem(key);
};
