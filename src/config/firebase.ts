import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDPYDcc8aj1z2gWAOZeas-C-Y7syqCLo74",
  authDomain: "cosing-9357b.firebaseapp.com",
  projectId: "cosing-9357b",
  storageBucket: "cosing-9357b.appspot.com",
  messagingSenderId: "560104564516",
  appId: "1:560104564516:web:1ccf61b7dd77565bddb5b1",
  measurementId: "G-9FV5WKXQ3F"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
