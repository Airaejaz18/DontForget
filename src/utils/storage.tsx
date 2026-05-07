import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveProfilePhoto = async (uri: string) => {
  await AsyncStorage.setItem("profilePhoto", uri);
};

export const getProfilePhoto = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("profilePhoto");
};

export const deleteProfilePhoto = async () => {
  await AsyncStorage.removeItem("profilePhoto");
};
