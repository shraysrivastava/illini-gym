import { useState, useCallback } from "react";
import {
  getDoc,
  doc,
  collection,
  updateDoc,
  arrayRemove,
  deleteField,
} from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";

export interface SectionDetails {
  isOpen: boolean;
  name: string;
  lastUpdated: string;
  count: number;
  capacity: number;
  isPopular: boolean;
  key: string;
}

export const useFavorites = (currentUserId: string | undefined) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteSections, setFavoriteSections] = useState<
    { gym: string; section: SectionDetails }[]
  >([]);
  const [sectionNicknames, setSectionNicknames] = useState<
    Record<string, string>
  >({});


  const fetchAndUpdateFavorites = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const userDoc = await getDoc(doc(db, "users", currentUserId));
      if (!userDoc.exists()) return;

      const userFavorites: string[] = userDoc.data().favorites || [];
      setFavorites(userFavorites);

      const userNicknames: Record<string, string> =
        userDoc.data().nicknames || {};
      setSectionNicknames(userNicknames);

      const newPressedSections: Record<string, boolean> = {};
      const promises = userFavorites.map(async (fav) => {
        const [gym, sectionId] = fav.split("=");
        const sectionDoc = await getDoc(doc(db, gym, sectionId));
        newPressedSections[sectionId] = true; // Update pressedSections
        return sectionDoc.exists()
          ? { gym, section: { key: sectionId, ...sectionDoc.data() } }
          : null;
      });

      const fetchedData = (await Promise.all(promises)).filter(Boolean);
      setFavoriteSections(
        fetchedData as { gym: string; section: SectionDetails }[]
      );
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  }, [currentUserId]);

  
  

  return {
    favorites,
    setFavorites,
    favoriteSections,
    setFavoriteSections,
    sectionNicknames,
    setSectionNicknames,
    fetchAndUpdateFavorites,
  };
};
