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
    likeCount: 0,
    createdAt: new Date(),
  });
  return { id: docRef.id, ...data, likeCount: 0 };
}

export async function updateQuote(
  id: string,
  data: Partial<{ text: string; author: string }>
) {
  const ref = doc(db, "quotes", id);
  await updateDoc(ref, { ...data, updatedAt: new Date() });
}

export async function deleteQuote(id: string) {
  const ref = doc(db, "quotes", id);
  await deleteDoc(ref);
}


export async function fetchUserQuotes(userEmail: string) {
  const q = query(quotesCol, where("createdBy", "==", userEmail));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
