import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {initializeAuth} from 'firebase/auth';
import {getReactNativePersistence} from 'firebase/auth/react-native';
import { getFirestore } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
export const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

export const db = getFirestore(app);