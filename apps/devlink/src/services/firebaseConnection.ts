import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAr5ustCQTj5dgFd2VIMcEUp3Pnb_RadbQ",
  authDomain: "devlink-112c3.firebaseapp.com",
  projectId: "devlink-112c3",
  storageBucket: "devlink-112c3.firebasestorage.app",
  messagingSenderId: "570948525989",
  appId: "1:570948525989:web:3ae30281143a734c8c524c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export {auth, db}