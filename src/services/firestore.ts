import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { firebaseApp } from "../firebaseConfig";
import { Quote } from "../quotes";

const db = getFirestore(firebaseApp);

export async function fetchQuotes(): Promise<Quote[]> {
  const snapshot = await getDocs(collection(db, "quotes"));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Quote[];
}

export async function createQuote(data: Omit<Quote, "id">) {
  const docRef = await addDoc(collection(db, "quotes"), data);
  return { id: docRef.id, ...data };
}

export async function updateQuote(id: string, data: Partial<Quote>) {
  const docRef = doc(db, "quotes", id);
  await updateDoc(docRef, data);
}

export async function deleteQuote(id: string) {
  const docRef = doc(db, "quotes", id);
  await deleteDoc(docRef);
}

export async function toggleLikeInDb(quoteId: string, userId: string) {
  const docRef = doc(db, "quotes", quoteId);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return;

  const data = snap.data() as Quote;
  const likedBy = data.likedBy || [];
  let newLikedBy: string[];
  let newLikeCount = data.likeCount || 0;

  if (likedBy.includes(userId)) {
    newLikedBy = likedBy.filter((id) => id !== userId);
    newLikeCount = Math.max(0, newLikeCount - 1);
  } else {
    newLikedBy = [...likedBy, userId];
    newLikeCount = newLikeCount + 1;
  }

  await updateDoc(docRef, {
    likedBy: newLikedBy,
    likeCount: newLikeCount,
  });
}
