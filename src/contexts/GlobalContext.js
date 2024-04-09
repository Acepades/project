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
import { collection, onSnapshot } from 'firebase/firestore';
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
  const [username, setUsername] = useState(""); // New state for username

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
            username,
          };
          // Automatically create a new user document
          await setDoc(userDocRef, newUser);
          setUser({ ...newUser, uid: user.uid }); // Update user state with initial data
        }
        setIsSignedIn(true);
      } else {
        // User logged out
        setUser(null);
        setUsername(""); // Reset username on logout
        setIsSignedIn(false);
      }
    });

    return unsubscribe;
  }, [username]);

  const checkUserExists = async (userId) => {
    const userDocRef = doc(usersCollectionRef, userId);
    const userDocSnap = await getDoc(userDocRef);
    console.log(userDocSnap.exists());
    return userDocSnap.exists();
  };


  // Functions handling auth
  const signIn = async (email, password) => {
    try {
      const username = email.split('@')[0]; // Extract username before "@"
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      // Update username in Firestore
      const userDocRef = doc(usersCollectionRef, firebaseAuth.currentUser.uid);
      await setDoc(userDocRef, { username });
      // Update username in context
      setUsername(username);
      return;
    } catch (err) {
      console.log(err.message);
      return err.message;
    }
  };

  const signUp = async (email, password) => {
    try {
      const username = email.split('@')[0]; // Extract username before "@"
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      // Create user document with extracted username
      const userDocRef = doc(usersCollectionRef, firebaseAuth.currentUser.uid);
      const newUser = {
        // ...other fields
        username,
      };
      await setDoc(userDocRef, newUser);
      // Update username in context
      setUsername(username);
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
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;

      // Check if a profile object exists
      if (user.profile) {
        const username = user.profile.name.split(' ')[0]; // Extract first name

        // Update username in Firestore and context
        const userDocRef = doc(usersCollectionRef, user.uid);
        await setDoc(userDocRef, { username });
        setUsername(username);
      } else {
        console.log('No profile information available from Google Sign-in.');
      }
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
        checkUserExists,
        username,
        setUsername,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
