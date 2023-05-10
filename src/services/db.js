import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import env from "react-dotenv";

let db = false;
export const getDb = () => {
  if (!db) {
    const firebaseConfig = {
      apiKey: env.REACT_APP_API_KEY,
      authDomain: env.REACT_APP_AUTH_DOMAIN,
      projectId: env.REACT_APP_PROJECT_ID,
      messagingSenderId: env.REACT_APP_MESSAGING_SENDER_ID,
      appId: env.REACT_APP_APP_ID,
      measurementId: env.REACT_APP_MEASUREMENT_ID,
    };

    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
};
