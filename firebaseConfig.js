import { initializeApp } from 'firebase/app';
import {initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCEVncTBUXopQ6oCf0pfSQSKgqFSmaAL9o",
    authDomain: "in-movement.firebaseapp.com",
    projectId: "in-movement",
    storageBucket: "in-movement.firebasestorage.app",
    messagingSenderId: "308264191127",
    appId: "1:308264191127:web:401ce97f7a3ae23e8b15d2"
  };
  
  // const app = initializeApp(firebaseConfig);
  // const auth = getAuth(app);
  
  // Initialize Firebase app
  const app = initializeApp(firebaseConfig);

  // Initialize Firebase Auth with AsyncStorage persistence
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });

  // Initialize Cloud Firestore and get a reference to the service
  const inMovementDb = getFirestore(app);

  export { auth, inMovementDb };