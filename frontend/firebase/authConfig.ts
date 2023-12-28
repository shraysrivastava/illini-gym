import { createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { FirebaseError } from "firebase/app";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const signInAnonymouslyUser = (setError: React.Dispatch<React.SetStateAction<string>>) => {
    return signInAnonymously(auth)
        .then((userCredential) => {
            const user = userCredential.user;

            const db = getFirestore();
            return setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                favorites: [],
                nicknames: {},
                createdAt: new Date()
            }).then(() => userCredential);
            
        })
        .catch((error: FirebaseError) => {
            authError(error, setError);
            throw error;
        });
};

export const createNewAccount = async () => {
    try {
        await AsyncStorage.clear();
        console.log('AsyncStorage has been cleared');
      } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
      }
};

export const signUpUser = (name: string, email: string, password: string,  setError: React.Dispatch<React.SetStateAction<string>>) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            updateProfile(user, {
                displayName: name,
            })
            .catch((error: FirebaseError) => authError(error, setError));

            //sets new user document in firestore
            const db = getFirestore();
            setDoc(doc(db, "users", userCredential.user.uid), {
                name: name,
                email: email,
                favorites: []
              }).catch((error: FirebaseError) => authError(error, setError));
        })
        .catch((error: FirebaseError) => authError(error, setError));
};


  
export const signInUser = (email: string, password: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
    signInWithEmailAndPassword(auth, email, password).catch((error: FirebaseError) => authError(error, setError));
    // AsyncStorage.setItem('userUID', user.uid);

};

export const signOutUser = async (setError: React.Dispatch<React.SetStateAction<string>>) => {
    signOut(auth).catch((error: FirebaseError) => authError(error, setError));
    try {
        await AsyncStorage.clear();
        console.log('AsyncStorage has been cleared');
      } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
      }
};

const authError = (error: FirebaseError, setError: React.Dispatch<React.SetStateAction<string>>) => {
    const errorCode: string = error.code;
    setError(errorCode.split('/')[1].replace(/-/g, ' '));
};


