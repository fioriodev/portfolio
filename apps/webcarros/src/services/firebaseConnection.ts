import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAx8LkmFCWslEZkJLd803TQfCvgljwoUw",
  authDomain: "webcarros-194be.firebaseapp.com",
  projectId: "webcarros-194be",
  storageBucket: "webcarros-194be.firebasestorage.app",
  messagingSenderId: "511462284801",
  appId: "1:511462284801:web:f51eab37fb7a353d522a00"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const storage = getStorage(app)
const db = getFirestore(app)

export { auth, storage, db }