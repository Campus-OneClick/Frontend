import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAtVvAswUD4YzyLenf9kqoIz2jInI0Blro",
  authDomain: "campus-oneclick.firebaseapp.com",
  projectId: "campus-oneclick",
  storageBucket: "campus-oneclick.firebasestorage.app",
  messagingSenderId: "1035515680037",
  appId: "1:1035515680037:web:7a218d70ca982918ac76cc",
  measurementId: "G-KMQR6T90PH",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { app, auth, analytics };
export default app;