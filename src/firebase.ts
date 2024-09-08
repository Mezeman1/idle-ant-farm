import firebase from 'firebase/compat/app'
import { getFirestore, collection } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
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

const appCheck = initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaV3Provider(import.meta.env.VITE_APP_RECAPTCHA_SITEKEY),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true,
})
const initFirebase = async () => {
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
}


export { db, analytics, initFirebase }

