import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC76IlKqNZFkGq2cqNHDKjIqRmlph2pR1g",
  authDomain: "fjusoccer.firebaseapp.com",
  projectId: "fjusoccer",
  storageBucket: "fjusoccer.firebasestorage.app",
  messagingSenderId: "700113518317",
  appId: "1:700113518317:web:8761187e3f366fcf1556e4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export { auth }