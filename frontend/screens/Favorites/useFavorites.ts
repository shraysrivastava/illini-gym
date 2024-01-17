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
  key: string; // ie. gym-1, gym-2
  gym: string; // ie. arc, now integrated into each section
  level: string;
}

export const useFavorites = (currentUserId: string | undefined) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteSections, setFavoriteSections] = useState<SectionDetails[]>([]);
  const [sectionNicknames, setSectionNicknames] = useState<Record<string, string>>({});

  const fetchAndUpdateFavorites = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const userDoc = await getDoc(doc(db, "users", currentUserId));
      if (!userDoc.exists()) return;

      const userFavorites: string[] = userDoc.data().favorites || [];
      setFavorites(userFavorites);

      const userNicknames: Record<string, string> = userDoc.data().nicknames || {};
      setSectionNicknames(userNicknames);

      const fetchedSections: (SectionDetails | null)[] = await Promise.all(
        userFavorites.map(async (fav) => {
          const [gym, sectionId] = fav.split("=");
          const sectionDoc = await getDoc(doc(db, gym, sectionId));
          return sectionDoc.exists()
            ? { gym, key: sectionId, ...sectionDoc.data() } as SectionDetails
            : null;
        })
      );

      const validSections: SectionDetails[] = fetchedSections.filter((section): section is SectionDetails => section !== null);
      setFavoriteSections(validSections);
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

