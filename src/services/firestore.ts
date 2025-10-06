import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export interface Quote {
  id: string;
  text: string;
  author: string;
  createdAt?: number;
  createdBy: string;
  likedBy: string[];
  likeCount?: number;
}

// ✅ Fetch Quotes
export async function fetchQuotes(): Promise<Quote[]> {
  const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as any;
    return {
      id: docSnap.id,

      text: data.text ?? data.quote ?? "",
      author: data.author ?? "",
      createdBy: data.createdBy ?? "",
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toMillis()
          : typeof data.createdAt === "number"
          ? data.createdAt
          : undefined,
      likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
      likeCount:
        typeof data.likeCount === "number"
          ? data.likeCount
          : Array.isArray(data.likedBy)
          ? data.likedBy.length
          : 0,
    };
  });
}

// ✅ Add New Quote
export async function createQuote(
  data: { text: string; author: string },
  userId: string
): Promise<Quote> {
  const payload = {
    text: data.text,
    author: data.author,
    createdBy: userId,
    createdAt: serverTimestamp(),
    likedBy: [],
    likeCount: 0,
  };

  const docRef = await addDoc(collection(db, "quotes"), payload);

  return {
    id: docRef.id,
    ...payload,
    createdAt: Date.now(), // UI için fallback
  } as Quote;
}

// ✅ Update
export async function updateQuote(id: string, data: Partial<Quote>) {
  const docRef = doc(db, "quotes", id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

// ✅ Delete
export async function deleteQuote(id: string) {
  const docRef = doc(db, "quotes", id);
  await deleteDoc(docRef);
}

// ✅ Like toggle
export async function toggleLikeInDb(
  quoteId: string,
  userId: string,
  hasLiked: boolean
): Promise<string[]> {
  const docRef = doc(db, "quotes", quoteId);

  if (hasLiked) {
    await updateDoc(docRef, { likedBy: arrayRemove(userId) });
  } else {
    await updateDoc(docRef, { likedBy: arrayUnion(userId) });
  }

  const snap = await getDoc(docRef);
  if (!snap.exists()) return [];

  const data = snap.data() as any;
  const likedBy: string[] = Array.isArray(data.likedBy) ? data.likedBy : [];

  await updateDoc(docRef, { likeCount: likedBy.length });

  return likedBy;
}
