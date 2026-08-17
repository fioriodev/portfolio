import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

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

export { auth }