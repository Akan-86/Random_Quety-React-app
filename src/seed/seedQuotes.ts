import {
  getFirestore,
  writeBatch,
  doc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../firebaseConfig";
import { quotesData } from "./quotesData";

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export async function seedQuotes() {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be logged in to seed quotes");

  const batch = writeBatch(db);
  const colRef = collection(db, "quotes");

  quotesData.forEach((q) => {
    const newDoc = doc(colRef); // otomatik ID
    batch.set(newDoc, {
      ...q,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      likeCount: 0,
      likedBy: [],
    });
  });

  await batch.commit();
  console.log("✅ Quotes seeded successfully!");
}
