import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDXZAaO_cSMEZXxcQc2FLr2abGymuLCSG4",
  authDomain: "nwitter-202409.firebaseapp.com",
  projectId: "nwitter-202409",
  storageBucket: "nwitter-202409.appspot.com",
  messagingSenderId: "29806873216",
  appId: "1:29806873216:web:7ae8d32216c55d3b323465"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);