//import {useContext} from 'react'
import { initializeApp } from "firebase/app";
import {useUserDispatch} from './UserContext'
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";

  // Your web app's Firebase configuration
  // This is apparently safe to upload to VC and web because api permissions are set in firebase console. Approve list IP or domains.
  // for example : IP restriction could be something like 2601:601::/32 (match the first 32 bits of IP)
  // https://stackoverflow.com/questions/37482366/is-it-safe-to-expose-firebase-apikey-to-the-public
  //https://console.cloud.google.com/apis/credentials?project=fir-auth-deaa9
const firebaseConfig = {
  apiKey: "AIzaSyCv5bXVnYOryN5FdsZgj9yE1167bKW-KeQ",
  authDomain: "sixth-well-353401.firebaseapp.com",
  projectId: "sixth-well-353401",
  storageBucket: "sixth-well-353401.appspot.com",
  messagingSenderId: "624670306919",
  appId: "1:624670306919:web:fb8a61c55c9219ef149ac2"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthStateChanged = async () => {

  const userDispatch = useUserDispatch();
  auth.onAuthStateChanged((user)=>{
    if (user){
      console.log(user);
      userDispatch({
        type: 'changed',
        user: user
      })
    } else {
      console.log('no user');
      userDispatch({
        type: 'changed',
        user: null
      })
    }
  })
}

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    return res.user;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const registerWithEmailAndPassword = async (email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user
    return user;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = async () => {
  await signOut(auth);

  // this should return null
  return auth.currentUser;
};

const getCurrentUser = async () => {
  return auth.currentUser;
}

const UpdateDisplayName = async (displayName) => {
  await updateProfile(auth.currentUser, {
    displayName: displayName
  });

  return auth.currentUser;
}

export {
  auth,
  //db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
  getCurrentUser,
  UpdateDisplayName,
  AuthStateChanged
};