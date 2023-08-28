//import {useContext} from 'react'
import { initializeApp } from "firebase/app";
import {useUserDispatch} from './UserContext'
import {useListDispatch} from './ParcelListContext'
import axios from 'axios'
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithRedirect,
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

console.log('firebase.js');
let currUser = null;

const AuthStateChanged = async () => {
  //console.log('auth state changed');

  const userDispatch = useUserDispatch();

  // get access to parcel List Dispatch;
  const listDispatch = useListDispatch();


  // when auth state is changed AND there is a user present (meaning a new login)
  // tell user context about user, and tell list context to update favorites.
  auth.onAuthStateChanged((user)=>{
    console.log(user);
    console.log(currUser);
    if (user && currUser != user){
      console.log(user);
      currUser = user;
      userDispatch({
        type: 'changed',
        user: user
      })

    console.log('Getting user favorites from Firebase...');

      let data = JSON.stringify({
         "user" : user
      })

    let config = {
      method : 'post',
      url: '/api/getUserFavorites',
      headers: {
            'Content-Type': 'application/json', 
            'Accept': 'application/json' 
      },
      data : data
    };

    axios(config)
    .then((response) => {
      //console.log(JSON.stringify(response.data))
      //console.log(response.data)
      if (response.data != 'error' && response.data.length >=1) {
        // send results to context
        // tell parcel list dispatch to look at user's favorites list.
        listDispatch({
          type: 'authStateChanged_getFavorites',
          favorites: response.data
        })
      }
    })
    .catch((error) => {
      console.log(error);
    });

      // TODO create a parcel list dispatch that un-sets all favorite parcels in parcel list
    } else if(!user) {
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