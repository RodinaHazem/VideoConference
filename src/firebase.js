
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCOjGOmFZE3lhUA_EXCw8dxt9eihUj_UzI",
    authDomain: "video-conference-app-cdb99.firebaseapp.com",
    projectId: "video-conference-app-cdb99",
    storageBucket: "video-conference-app-cdb99.firebasestorage.app",
    messagingSenderId: "939081970909",
    appId: "1:939081970909:web:5b140ba225769ede059734",
    measurementId: "G-SY7DNE8267"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);