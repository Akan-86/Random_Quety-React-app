import {
  getFirestore,
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { firebaseApp } from "../firebaseConfig"; 
const db = getFirestore(firebaseApp);
const quotesCol = collection(db, "quotes");

export async function fetchQuotes() {
  const snap = await getDocs(quotesCol);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createQuote(data: {
  text: string;
  author: string;
  createdBy: string; 
}) {
  const docRef = await addDoc(quotesCol, {
    ...data,
    likedBy: [], 
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, ...data, likedBy: [], likeCount: 0 };
}

export async function updateQuote(
  id: string,
  data: Partial<{ text: string; author: string }>
) {
  const ref = doc(db, "quotes", id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteQuote(id: string) {
  const ref = doc(db, "quotes", id);
  await deleteDoc(ref);
}

export async function fetchUserQuotes(userUid: string) {
  const q = query(quotesCol, where("createdBy", "==", userUid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}


export async function toggleLikeInDb(quoteId: string, userId: string, hasLiked: boolean) {
  const ref = doc(db, "quotes", quoteId);
  if (hasLiked) {
    await updateDoc(ref, { likedBy: arrayRemove(userId), updatedAt: serverTimestamp() });
  } else {
    await updateDoc(ref, { likedBy: arrayUnion(userId), updatedAt: serverTimestamp() });
  }
}