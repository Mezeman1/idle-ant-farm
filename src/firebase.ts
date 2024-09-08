import firebase from 'firebase/compat/app'
import { getFirestore, collection } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
// ... other firebase imports

export const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyC-iXDOWE7d6YFbTPklOXgkK-ca7ePlI9w',
  authDomain: 'idleantfarm.firebaseapp.com',
  projectId: 'idleantfarm',
  storageBucket: 'idleantfarm.appspot.com',
  messagingSenderId: '862631118579',
  appId: '1:862631118579:web:1b40be2d081fc2d0ed5986',
  measurementId: 'G-LWCZP322K6',
})

// used for the firestore refs
const db = getFirestore()
const analytics = getAnalytics()

const initFirebase = async () => {
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
}


export { db, analytics, initFirebase }

