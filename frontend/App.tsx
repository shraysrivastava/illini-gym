import React, { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";
import { DocumentData } from "firebase/firestore";
import { fetchUserData } from "./firebase/firestore";
import { BottomNav } from "./screens/BottomNav";
import { signInAnonymouslyUser } from "./firebase/authConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<DocumentData>();

  const inspectAsyncStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      
      items.forEach(([key, value]) => {
        // console.log(key, value);
      });
    } catch (error) {
      // console.error('Error inspecting AsyncStorage:', error);
    }
  };
  
  
  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      inspectAsyncStorage();
      if (currentUser) {
        // console.log("User is signed in (or restored)");
        setUser(currentUser);
      } else {
        // console.log("No user signed in, attempting anonymous sign-in");
        signInAnonymouslyUser(() => {})
          .then((userCredential) => {
            // console.log("Anonymously signed in");
            setUser(userCredential.user);
          })
          .catch((error) => {
            // console.error("Anonymous auth error:", error);
          });
      }
    });
  
    return () => unsubscribe();
  }, []);

  // User is authenticated
  if (user) {
    return (
      <BottomNav
          user={user}
          userData={userData}
          fetchUserData={fetchUserData}
          setUserData={setUserData}
        />
    );
  }
}

