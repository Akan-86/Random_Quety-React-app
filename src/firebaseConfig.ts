import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  
};

export const firebaseApp = initializeApp(firebaseConfig);
