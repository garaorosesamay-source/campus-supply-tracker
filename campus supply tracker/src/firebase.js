import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAoGP77GMIOJCPelE67f8zy3qyLWHZaLE",
  authDomain: "inventory-53b1f.firebaseapp.com",
  projectId: "inventory-53b1f",
  storageBucket: "inventory-53b1f.firebasestorage.app",
  messagingSenderId: "979846521821",
  appId: "1:979846521821:web:5021cc32df36b0991c0c34",
  measurementId: "G-Y2LTMKPVT0"
};

// initialize firebase app
const app = initializeApp(firebaseConfig);

// initialize authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

// initialize firestore with persistent offline cache enabled
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});