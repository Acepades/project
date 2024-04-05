import React, { useState, useEffect } from 'react';
// Firebase auth functions
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';

// Firestore functions (for user document interaction)
import { getDoc, setDoc, doc } from 'firebase/firestore';

// Firebase auth instance
import firebaseAuth from 'lib/firebase';
// User collection reference
import {collection, onSnapshot } from 'firebase/firestore';
import { db } from 'lib/firebase'; // Assuming you export db from firebase.js
const usersCollectionRef = collection(db, "Users");

// Google oauth provider
const provider = new GoogleAuthProvider();

// Contexts
export const GlobalContext = React.createContext(null);

export const ContextProvider = (props) => {
  // States to check auth status
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        // User logged in
        const userDocRef = doc(usersCollectionRef, user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          // User document exists, update user state
          onSnapshot(userDocRef, (docSnapshot) => {
            setUser({ ...docSnapshot.data(), uid: user.uid });
          });
        } else {
          // User document doesn't exist, create a new one (optional)
          const newUser = {
            level: 1,
            experience: 0,
            req_experience: 100,
            badges: [],
          };
          // Automatically create a new user document
          await setDoc(userDocRef, newUser);
          setUser({ ...newUser, uid: user.uid }); // Update user state with initial data
        }
        setIsSignedIn(true)
      } else {
        // User logged out
        setUser(null);
        setIsSignedIn(false);
      }
    });

    return unsubscribe;
  });

  // Functions handling auth
  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      return;
    } catch (err) {
      console.log(err.message);
      return err.message;
    }
  };

  const signUp = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      return;
    } catch (err) {
      console.log(err.message);
      return err.message;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(firebaseAuth);
    } catch (err) {
      console.log(err.message);
    }
  };

  const googleSignIn = async () => {
    try {
      await signInWithPopup(firebaseAuth, provider);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Context provider
  return (
    <GlobalContext.Provider
      value={{
        isSignedIn,
        user,
        signIn,
        signUp,
        signOut,
        googleSignIn,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
