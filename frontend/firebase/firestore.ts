import { User } from "firebase/auth";
import { doc, getDoc, DocumentData, collection, getDocs, addDoc, updateDoc, query, deleteDoc, where} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { FirebaseError } from "firebase/app";
import { SetStateAction } from "react";

/**
 * Gets the data associated with the user
 * @param user user to get data from
 * @returns user's document data (or null if doesn't exist)
 */

 interface EventData {
  date: string;
  description: string;
  isClosed: boolean;
  sectionKey: string;
  time: string;
  title: string;
}
interface ReportData {
  room: string;
  report: string;
    timestamp: Date;
  }
  // Fetch all events
  // Fetch all events from the 'calendar-events' collection
export const fetchEvents = async (): Promise<EventData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'calendar-events'));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Here, we are casting the data to EventData, assuming all fields are present
      return {
        date: data.date,
        description: data.description,
        isClosed: data.isClosed,
        sectionKey: data.sectionKey,
        time: data.time,
        title: data.title,
      } as EventData;
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Fetch events by date from the 'calendar-events' collection
export const fetchEventsByDate = async (date: string): Promise<EventData[]> => {
  try {
    const eventsQuery = query(
      collection(db, 'calendar-events'), 
      where('date', '==', date)
    );
    const querySnapshot = await getDocs(eventsQuery);
    return querySnapshot.docs.map(doc => doc.data() as EventData);
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};




  export const submitBugReport = async (reportData: ReportData) => {
    try {
      await addDoc(collection(db, "bug"), {
        ...reportData,
        timestamp: new Date() 
      });
      console.log("Bug report submitted successfully");
    } catch (error) {
      console.error("Error submitting bug report:", error);
    }
  };
  
  export const submitFeedback = async (reportText: string) => {
    try {
      await addDoc(collection(db, "feedback"), {
        report: reportText,
        timestamp: new Date()
      });
      console.log("Feedback submitted successfully");
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };
  
  export const fetchUserData = (user: User, setUserData: {(value: SetStateAction<DocumentData | undefined>): void}) => {
    const userRef = doc(db, 'users', user.uid);
    getDoc(userRef).then((userData: DocumentData) => {
      setUserData(userData.data());
      console.log(userData.data());
    }).catch((error: FirebaseError) => {
      handleError(error);
    });
  };
  
const handleError = (error: FirebaseError) => {
  const errorCode: string = error.code;
  const errorMessage = error.message;
  console.log(errorCode, errorMessage);
}