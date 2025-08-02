import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyATHSx-b1Z6M7xW8rdsTuDN7yjTeY-IBMI",
  authDomain: "random-quety-react-app.firebaseapp.com",
  projectId: "random-quety-react-app",
  storageBucket: "random-quety-react-app.firebasestorage.app",
  messagingSenderId: "519096057012",
  appId: "1:519096057012:web:00ecd95006d3c260e62be1",
  measurementId: "G-75206S1Y9D"
};

export const firebaseApp = initializeApp(firebaseConfig);
