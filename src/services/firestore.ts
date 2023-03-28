import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import constants from '@/constants';

const firebaseConfig = constants.FIREBASE_CONFIG;
const path = constants.DB_COLLECTION_PATH;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export async function setRemote(name: string, value: any) {
  return await setDoc(doc(db, path, name), value);
}

// https://firebase.google.com/docs/firestore/query-data/get-data?hl=zh-cn
export async function getRemote(key: string): Promise<{ data: string } | undefined> {
  const docRef = doc(db, path, key);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log('Document data:', docSnap.data());
  } else {
    // doc.data() will be undefined in this case
    // console.log('No such document!');
  }

  return docSnap.data() as any;
}
