// fetchImageFromFirebase.js
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const fetchImageFromFirebase = async (imagePath) => {
  const storage = getStorage();
  const imageRef = ref(storage, imagePath);

  try {
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error('Error fetching image from Firebase Storage:', error);
    return null;
  }
};

export default fetchImageFromFirebase;
