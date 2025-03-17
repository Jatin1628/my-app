// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqB8Jj7zAzdktNy8qHcTMO3ju4PpArS00",
  authDomain: "jarvis55.firebaseapp.com",
  projectId: "jarvis55",
  storageBucket: "jarvis55.firebasestorage.app",
  messagingSenderId: "314430430135",
  appId: "1:314430430135:web:e8d052bc668e29705d2632",
  measurementId: "G-46Z1CGFBSF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);