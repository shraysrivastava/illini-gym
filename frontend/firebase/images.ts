// fetchImageFromFirebase.js
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const fetchImageFromFirebase = async (imagePath: string) => {
  const storage = getStorage();
  const imageRef = ref(storage, imagePath);

  try {
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    return null;
  }
};

export default fetchImageFromFirebase;
