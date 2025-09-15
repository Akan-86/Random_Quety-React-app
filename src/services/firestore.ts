import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  arrayUnion,
  arrayRemove,
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

export async function toggleLikeInDb(
  quoteId: string,
  userId: string,
  hasLiked: boolean
): Promise<string[]> {
  const docRef = doc(db, "quotes", quoteId);

  if (hasLiked) {
    await updateDoc(docRef, {
      likedBy: arrayRemove(userId),
    });
  } else {
    await updateDoc(docRef, {
      likedBy: arrayUnion(userId),
    });
  }

  const snap = await getDoc(docRef);
  if (!snap.exists()) return [];

  const updatedData = snap.data() as Quote;
  const updatedLikedBy = updatedData.likedBy || [];

  await updateDoc(docRef, {
    likeCount: updatedLikedBy.length,
  });

  return updatedLikedBy;
}
