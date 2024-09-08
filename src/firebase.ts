import firebase from 'firebase/compat/app'
import { getFirestore, collection } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
// ... other firebase imports

export const firebaseApp = firebase.initializeApp({
  apiKey: import.meta.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
})

// used for the firestore refs
const db = getFirestore()
const analytics = getAnalytics()

const initFirebase = async () => {
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
}


export { db, analytics, initFirebase }
