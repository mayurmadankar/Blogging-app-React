// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoWUT5dCcbRCHa2yHwhKUzg22Ame_mNs4",
  authDomain: "blogging-app-bae50.firebaseapp.com",
  projectId: "blogging-app-bae50",
  storageBucket: "blogging-app-bae50.firebasestorage.app",
  messagingSenderId: "433396678452",
  appId: "1:433396678452:web:bd107bb7082e34c397af61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

